"""Per-product photographic reference models. Shape and dimensions are estimated.
The JSON annotations hold separate lens outlines, roll correction and arm crops.
"""
from pathlib import Path
import sys,json,struct
import numpy as np,cv2,trimesh
from PIL import Image,ImageDraw
from io import BytesIO
from scipy.ndimage import distance_transform_edt,gaussian_filter1d
from scipy.interpolate import PchipInterpolator
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from collection import Model,curve
import collection
ROOT=Path(__file__).resolve().parents[3]
WORK=Path(__file__).resolve().parent
OUT=ROOT/'models/catalog/photographic-v4';OUT.mkdir(exist_ok=True)
collection.OUT=OUT
CONFIG=json.loads((WORK/'annotations.json').read_text())
N=192
COL={'gold':[.72,.53,.25,1],'silver':[.55,.57,.57,1],'rose':[.69,.40,.29,1],'black':[.005,.006,.008,1],'navy':[.006,.015,.040,1],'orange':[1,.26,.015,1],'clear':[.87,.93,.97,.25],'champagne':[.80,.66,.40,.42],'turquoise':[.015,.40,.44,1],'smoke':[.11,.13,.14,.62],'tortoise':[.24,.08,.018,1]}
def radial(poly,center):
 p=curve(poly,1800,True);v=p-center;theta=np.arctan2(v[:,1],v[:,0]);order=np.argsort(theta);a=theta[order];r=np.linalg.norm(v[order],axis=1)
 angles=np.arange(N)*2*np.pi/N-np.pi
 radius=np.interp(angles,np.r_[a[-1]-2*np.pi,a,a[0]+2*np.pi],np.r_[r[-1],r,r[0]])
 return center+radius[:,None]*np.c_[np.cos(angles),np.sin(angles)]
def valid_pixels(a,tone):
 f=a.astype(float);h=cv2.cvtColor(a,cv2.COLOR_RGB2HSV);sat=h[:,:,1]
 if tone in ['turquoise','emerald','green','blue','navy']:
  mask=((f[:,:,1]+f[:,:,2])>f[:,:,0]*1.95)&(sat>48)
 elif tone in ['amber','orange','tortoise','twotone','gold','rose']:
  mask=(f[:,:,0]>f[:,:,1]*1.025)&(sat>25)
 elif tone in ['black','carbon']:mask=f.max(2)<105
 elif tone=='smoke':mask=f.max(2)<185
 else:mask=f.max(2)<225
 return mask

def make(key,c):
 m=Model();m.kind=c['kind'];photo=Image.open(ROOT/c['photo']).convert('RGB').resize((800,600));a=np.array(photo)
 O0=np.array(c['outer'],float);center=np.array(c['inner'] if c['inner'] else c['outer'],float).mean(0)
 O=radial(O0,center)
 if c['inner']:I=radial(c['inner'],center)
 else:
  # Thin metal rims are traced at their centre line; derive a narrow inner edge.
  r=np.linalg.norm(O-center,axis=1);I=center+(O-center)*(1-2.8/r[:,None])
 # Snap the hand-traced contours onto each product's actual coloured rim.
 # White lens/background pixels separate the two edges on optical acetate.
 toneForEdges=c.get('metal','gold') if c['kind'] in ['metal','metal-brow'] else c['kind']
 if c['kind'] not in ['clear','champagne','metal','metal-brow']:
  originalO=O.copy();originalI=I.copy()
  materialPixels=valid_pixels(a,toneForEdges)
  for j in range(N):
   v=O[j]-center;rout=np.linalg.norm(v);vin=I[j]-center;rin=np.linalg.norm(vin);direction=v/rout
   radii=np.arange(max(1,rin-15),rout+20,.5);xy=center+radii[:,None]*direction
   xx=np.clip(np.rint(xy[:,0]).astype(int),0,799);yy=np.clip(np.rint(xy[:,1]).astype(int),0,599)
   line=materialPixels[yy,xx].astype('uint8');line=cv2.morphologyEx(line[None],cv2.MORPH_CLOSE,np.ones((1,3),np.uint8))[0]
   transitions=np.diff(np.r_[0,line,0].astype(int));starts=np.flatnonzero(transitions==1);ends=np.flatnonzero(transitions==-1)-1
   if not len(starts):continue
   midR=(rout+rin)/2
   choices=[(abs((radii[u]+radii[vv])/2-midR),u,vv) for u,vv in zip(starts,ends)]
   _,u,vv=min(choices)
   if radii[vv]-radii[u]<1:continue
   if abs(radii[vv]-rout)<19:O[j]=center+direction*radii[vv]
   if c.get('lens','clear') in ['clear','bluecut'] and abs(radii[u]-rin)<18:I[j]=center+direction*radii[u]
  directions=originalO-center;directions/=np.linalg.norm(directions,axis=1)[:,None]
  roSmooth=gaussian_filter1d(.55*np.linalg.norm(O-center,axis=1)+.45*np.linalg.norm(originalO-center,axis=1),2.4,mode='wrap')
  riSmooth=gaussian_filter1d(.55*np.linalg.norm(I-center,axis=1)+.45*np.linalg.norm(originalI-center,axis=1),2.4,mode='wrap')
  O=center+directions*roSmooth[:,None];I=center+directions*np.minimum(riSmooth,roSmooth-2.0)[:,None]
 ro=np.linalg.norm(O-center,axis=1);ri=np.linalg.norm(I-center,axis=1)
 bad=ri>ro-1.3
 I[bad]=center+(I[bad]-center)*(np.maximum(ro[bad]-1.3,1)/ri[bad])[:,None]
 photoO=O.copy();photoI=I.copy()
 if c['kind'] not in ['clear','champagne','metal','metal-brow']:
  # Keep the smooth hand-traced physical contour; edge snapping is used for
  # photographic material sampling, not to emboss pixel noise into the frame.
  O=originalO;I=originalI
 roll=np.deg2rad(c['roll']);A=np.array([[np.cos(roll),np.sin(roll)],[-np.sin(roll),np.cos(roll)]])
 q=(O-center)@A.T;lo=q.min(0);hi=q.max(0);mid=(lo+hi)/2;span=hi-lo
 # Rectify the remaining affine perspective shear of the photographed lens.
 # Individual contour points stay product-specific; only the camera plane changes.
 transform=np.diag([c['near']*c['width']/span[0],-c['height']/span[1]])@A
 cat=key in ['prod-new-3','prod-3','prod-r3','prod-r5','prod-sun-w2']
 pilot=key in ['prod-new-1','prod-r7','prod-r8','prod-r11','prod-new-5','prod-sun-1']
 desiredTopDelta=(.12 if cat else -.09 if pilot else 0)*c['width']
 desiredSideDelta=(.10 if cat else -.08 if pilot else 0)*c['height']
 physical=(O-center)@transform.T
 top=physical[physical[:,1]>physical[:,1].max()-.17*c['height']].mean(0)
 bottom=physical[physical[:,1]<physical[:,1].min()+.17*c['height']].mean(0)
 k=(top[0]-bottom[0]-desiredTopDelta)/(top[1]-bottom[1]);transform[0]-=np.clip(k,-.65,.65)*transform[1]
 physical=(O-center)@transform.T;transform[0]*=c['width']/np.ptp(physical[:,0])
 physical=(O-center)@transform.T
 left=physical[physical[:,0]<physical[:,0].min()+.17*c['width']].mean(0)
 right=physical[physical[:,0]>physical[:,0].max()-.17*c['width']].mean(0)
 k=(right[1]-left[1]-desiredSideDelta)/(right[0]-left[0]);transform[1]-=np.clip(k,-.65,.65)*transform[0]
 physical=(O-center)@transform.T;transform[1]*=c['height']/np.ptp(physical[:,1])
 physical=(O-center)@transform.T;physicalMid=(physical.min(0)+physical.max(0))/2
 inverse=np.linalg.inv(transform)

 fw=2*c['width']+c['bridge'];hx=fw/2;armY=9.;armCentre=hx+7
 customFront=key in ['prod-6','prod-9']
 bridgeAnchor=7 if key=='prod-6' else 9 if key=='prod-9' else 8
 m.g['nodes'][0]['extras']={'frontWidthMm':fw,'bridgeAnchorMm':bridgeAnchor,'templeFit':{'centreX':armCentre,'armY':armY},'referenceProduct':key,'accuracy':'Contours and photographic materials from product images; dimensions estimated, not manufacturer CAD.'}
 texmeta=[]
 def tex(image,name):
  b=BytesIO();image.save(b,'PNG' if image.mode=='RGBA' else 'JPEG',**({} if image.mode=='RGBA' else {'quality':94,'subsampling':0}))
  while len(m.buf)%4:m.buf.append(0)
  vi=len(m.g['bufferViews']);m.g['bufferViews'].append(dict(buffer=0,byteOffset=len(m.buf),byteLength=len(b.getvalue())));m.buf.extend(b.getvalue())
  imgs=m.g.setdefault('images',[]);imgs.append({'bufferView':vi,'mimeType':'image/png' if image.mode=='RGBA' else 'image/jpeg'})
  ts=m.g.setdefault('textures',[]);ts.append({'source':len(imgs)-1});texmeta.append(name);return len(ts)-1
 def extend(im,mask):
  if mask.sum()<5:raise ValueError(key+' empty photographic material mask')
  _,idx=distance_transform_edt(~mask,return_indices=True);return im[tuple(idx)]
 maskim=Image.new('L',photo.size,0);d=ImageDraw.Draw(maskim);d.polygon([tuple(p) for p in photoO],fill=255);d.polygon([tuple(p) for p in photoI],fill=0)
 mask=np.array(maskim)>0
 if c['kind'] in ['metal','metal-brow']:tone=c.get('metal','gold')
 else:tone=c['kind']
 good=mask&valid_pixels(a,tone)
 # Retain colours on transparent crystal without sampling the white background.
 if good.sum()<20:good=mask&(a.max(2)<245)
 fronttex=tex(Image.fromarray(extend(a,good)),key+' frame photograph')
 def mat(name,color,metal=0,rough=.23,texture=None):
  i=m.mat(name,color,metal,rough)
  if texture is not None:m.g['materials'][i]['pbrMetallicRoughness']['baseColorTexture']={'index':texture}
  return i
 metalcolor=c.get('metal','silver' if c['kind'] in ['clear','smoke','blue'] else 'gold')
 hardware=mat('Reference '+metalcolor+' hinge metal',COL.get(metalcolor,COL['gold']),.85,.22)
 kind=c['kind'];alpha=.28 if kind=='clear' else .47 if kind=='champagne' else .68 if kind=='smoke' else .90 if kind=='amber' else 1
 frontmat=mat('Photographic '+kind+(' metal' if kind in ['metal','metal-brow'] else ' acetate'),[1,1,1,alpha],.78 if kind in ['metal','metal-brow'] else .02,.30 if kind=='navy' else .22,fronttex)
 def pixelToMM(p,sign):
  q=(p-center)@transform.T-physicalMid
  x=c['bridge']/2+c['width']/2+q[:,0];y=-7+q[:,1]
  return np.c_[sign*x,y,-4.0*(x/hx)**2]
 def mmToUV(p,sign):
  xy=np.c_[p[:,0]*sign-c['bridge']/2-c['width']/2,p[:,1]+7]+physicalMid
  pix=xy@inverse.T+center
  return np.clip(pix/[800,600],.001,.999).astype('float32')
 def setTubeUV():
  pr=m.g['meshes'][-1]['primitives'][0];access=m.g['accessors'][pr['attributes']['POSITION']];view=m.g['bufferViews'][access['bufferView']]
  pp=np.frombuffer(m.buf,dtype='<f4',count=access['count']*3,offset=view['byteOffset']).reshape(-1,3).copy()*1000
  pr['attributes']['TEXCOORD_0']=m.acc(mmToUV(pp,1),'34962' if False else 34962)
 def tube(name,points,r,d,material,loop=False,group=0,photoUV=False):
  m.tube(name,points,r,d,material,loop,group)
  if photoUV:setTubeUV()
 def rim(name,sign,outer,inner,material,depth=4.2,z=0,group=0,upper=False):
  # Broad flat front with rolled bevels; the rear face has a real physical depth.
  profile=[(0,-depth/2+.3),(0,0),(.09,depth/2-.35),(.23,depth/2),(.78,depth/2),(.95,depth/2-.4),(1,0),(1,-depth/2+.3),(.88,-depth/2),(.10,-depth/2)]
  pp=[];uvs=[]
  for t,dz in profile:
   p=inner+(outer-inner)*t;q=photoI+(photoO-photoI)*(.19+.62*t)
   world=pixelToMM(p,sign);world[:,2]+=z+dz;pp.extend(world);uvs.extend(q/[800,600])
  midpoints=(pixelToMM(inner,sign)+pixelToMM(outer,sign))/2;enabled=midpoints[:,1]>1.0 if upper else np.ones(N,bool)
  ff=[]
  for j in range(len(profile)):
   for k in range(N):
    kn=(k+1)%N
    if not (enabled[k] and enabled[kn]):continue
    aa=j*N+k;bb=j*N+kn;cc=((j+1)%len(profile))*N+k;dd=((j+1)%len(profile))*N+kn;ff.extend([[aa,bb,cc],[bb,dd,cc]])
  if upper:
   for k in range(N):
    if enabled[k] and (not enabled[k-1] or not enabled[(k+1)%N]):
     for j in range(1,len(profile)-1):ff.append([k,j*N+k,(j+1)*N+k])
  m.mesh(name,pp,ff,material,group,uv=uvs)
 lensKind=c.get('lens','clear')
 def lensmat(kind):
  if kind in ['amber','pink']:
   top=np.array([52,25,15] if kind=='amber' else [32,17,47]);bottom=np.array([174,140,102] if kind=='amber' else [224,129,173]);t=np.linspace(0,1,512)[:,None,None]
   col=np.broadcast_to(top*(1-t)+bottom*t,(512,256,3));tx=tex(Image.fromarray(np.uint8(col)),kind+' vertical gradient')
   return mat('Lens '+kind+' gradient',[1,1,1,.78],0,.1,tx)
  rgba={'clear':[.86,.93,.98,.08],'bluecut':[.64,.82,1,.10],'dark':[.021,.024,.027,.73],'green':[.026,.049,.034,.76]}[kind]
  return mat('Lens '+kind,rgba,0,.10)
 glass=lensmat(lensKind)
 m.g['materials'][glass]['doubleSided']=False
 m.g['materials'][glass]['extensions']={'KHR_materials_clearcoat':{'clearcoatFactor':.9,'clearcoatRoughnessFactor':.08}}
 def lens(name,pix,sign,material,group=0,z=0):
  outline=pixelToMM(pix,sign);center3=outline.mean(0);R=10;pp=[center3+[0,0,z+.8]];ff=[];uvs=[[.5,.5]]
  low=outline[:,:2].min(0);high=outline[:,:2].max(0)
  for t in np.linspace(.08,1,R):
   q=center3+(outline-center3)*t;q[:,2]+=z+.8*(1-t*t);pp.extend(q);uvs.extend(np.c_[(q[:,0]-low[0])/(high[0]-low[0]),(high[1]-q[:,1])/(high[1]-low[1])])
  ff.extend([[0,1+j,1+(j+1)%N] for j in range(N)])
  for i in range(R-1):
   for j in range(N):
    aa=1+i*N+j;bb=1+i*N+(j+1)%N;ff.extend([[aa,aa+N,bb],[bb,aa+N,bb+N]])
  pp=np.array(pp);ff=np.array(ff);normal=np.cross(pp[ff[:,1]]-pp[ff[:,0]],pp[ff[:,2]]-pp[ff[:,0]])
  if normal[:,2].sum()<0:ff=ff[:,::-1]
  # Stable orientation for an open optical sheet in the GLB writer.
  pp[:,2]+=100;m.mesh(name,pp,ff,material,group,uv=uvs);m.g['nodes'][-1]['translation']=[0,0,-.1]
  m.g['materials'][material]['doubleSided']=False
  m.g['materials'][material]['extensions']={'KHR_materials_clearcoat':{'clearcoatFactor':.9,'clearcoatRoughnessFactor':.08}}
 customVertices=None
 if customFront:
  # Keep the already sculpted, photo-specific moulded children's front. Rebuild
  # its temples, print, spring opening and optical material with the v4 pipeline.
  source=ROOT/'models'/('4D-Optical-Kids-Navy-Orange.glb' if key=='prod-6' else '4D-Optical-Kids-Turquoise.glb')
  original=trimesh.load(source);frontParts=[]
  colour=COL['navy'] if key=='prod-6' else [.002,.39,.43,1]
  mould=mat('Reference moulded navy' if key=='prod-6' else 'Reference moulded turquoise',colour,0,.32)
  for name,geometry in original.geometry.items():
   use=('Continuous moulded turquoise front' in name) if key=='prod-9' else any(word in name for word in ['Full frame rim','Acetate saddle bridge'])
   isLens=('Smoke lens' in name) if key=='prod-9' else name.startswith('Lens ')
   if use or isLens:
    if use:
     m.mesh('Reference sculpted front '+name,np.array(geometry.vertices)*1000,geometry.faces,mould)
     frontParts.append(np.array(geometry.vertices)*1000)
    else:
     sheet=trimesh.Trimesh(geometry.vertices.copy(),geometry.faces[geometry.face_normals[:,2]>.3],process=False);sheet.remove_unreferenced_vertices()
     pp=sheet.vertices*1000;pp[:,2]+=100;m.mesh('Optical lens '+name,pp,sheet.faces,glass);m.g['nodes'][-1]['translation']=[0,0,-.1]
  customVertices=np.vstack(frontParts)
 for sign in [-1,1]:
  if not customFront and kind in ['metal','metal-brow','club']:
   line=pixelToMM((O+I)/2,sign)
   metalrim=hardware if kind=='club' else frontmat
   tube('Fine metal full rim '+str(sign),line,.72 if kind!='metal-brow' else .65,.8,metalrim,True,photoUV=kind!='club')
   if kind!='metal':rim('Broad upper '+kind+' brow '+str(sign),sign,O,I,frontmat,depth=4.4 if kind=='club' else 1.8,upper=True)
  elif not customFront:rim('Traced bevelled frame '+str(sign),sign,O,I,frontmat,depth=5.5 if key in ['prod-r10','prod-r6','prod-sun-w1'] else 4.4)
  if not customFront:lens('Optical lens '+str(sign),I,sign,glass)
  if c.get('innerwire'):
   black=mat('Black inner lens wire',COL['black'],.3,.23);tube('Black inset lens rim '+str(sign),pixelToMM(I,sign)+[0,0,1],.45,.55,black,True)
  # Connect the actual hinge to the full arm; no floating temple above the face.
  attachLine=customVertices if customFront else pixelToMM((O+I)/2,sign)
  attach=attachLine[np.argmin(np.sum((attachLine-np.array([sign*(hx-1),armY,-4]))**2,axis=1))]
  tube('Reference hinge connection '+str(sign),curve([attach,(sign*hx,armY,-8),(sign*(hx+1),armY,-13)],24),1.2,1.5,hardware if c.get('arm') in ['gold','silver','rose'] else frontmat,photoUV=c.get('arm') not in ['gold','silver','rose'])
  for zz in [-7,-10]:tube('Hinge barrel '+str(sign),curve([(sign*hx,armY-2.0,zz),(sign*hx,armY+2.0,zz)],6),.65,.65,hardware)
  if c.get('pads') or kind in ['metal','metal-brow','club']:
   tube('Nose pad wire '+str(sign),curve([(sign*(c['bridge']/2+2),2,-1),(sign*(c['bridge']/2),-3,-5),(sign*(c['bridge']/2),-7,-7)],25),.45,.45,hardware)
   pad=mat('Silicone nose pad',[.84,.82,.74,.27],0,.17);tube('Clear nose pad '+str(sign),curve([(sign*(c['bridge']/2),-3,-7),(sign*(c['bridge']/2),-7,-8),(sign*(c['bridge']/2),-11,-7)],22),1.7,.8,pad)
  if kind=='club' or c.get('studs'):
   for stud in range(c.get('studs',1)):
    tube('Front metal stud '+str(sign),curve([(sign*(hx-3.6-stud*3),armY+1,-1),(sign*(hx-1.4-stud*3),armY+1,-1)],10),.45,.45,hardware)
 # Image-derived arm crop: exterior wordmark and pattern are retained from this product.
 armphoto=Image.open(ROOT/c['armPhoto']).convert('RGB').resize((800,600))
 q=np.float32(c['arm_quad']);H=cv2.getPerspectiveTransform(q,np.float32([[0,0],[1535,0],[1535,255],[0,255]]));strip=cv2.warpPerspective(np.array(armphoto),H,(1536,256),flags=cv2.INTER_CUBIC)
 armTone=c.get('arm',kind);valid=valid_pixels(strip,armTone)
 if valid.sum()<10:valid=strip.max(2)<245
 strip=extend(strip,valid)
 # Left-facing source arms need their printed panel restored to reading order.
 if q[1,0]<q[0,0]:strip[:,:1100]=strip[:,:1100][:,::-1]
 plain=cv2.resize(strip[:,1200:1510],(1536,256),interpolation=cv2.INTER_CUBIC)
 armtex={};armmats={}
 for sign in [1,-1]:
  exterior=strip.copy()
  if sign<0:exterior[:,:1100]=exterior[:,:1100][:,::-1]
  tx=tex(Image.fromarray(np.concatenate([exterior,plain],axis=0)),key+' exterior arm '+str(sign));armtex[sign]=tx
  metal=armTone in ['gold','silver','rose','blue'];alpha=.64 if armTone=='orange' and key=='prod-6' else .65 if armTone=='smoke' else 1
  armmats[sign]=mat('Photographic '+armTone+' temple '+str(sign),[1,1,1,alpha],.78 if metal else .02,.24,tx)
 L=c.get('templeLength',145);ry=c.get('armh',7)/2;rx=c.get('armw',3)/2
 rows=np.array([(8,hx+.2,armY,rx,ry),(15,hx+1,armY,rx,ry),(42,hx+5.8,armY-.15,rx*.97,ry*.91),(L-48,armCentre,armY-.35,rx*.92,ry*.74),(L-35,armCentre-.4,armY-.8,rx*.95,ry*.64),(L-24,armCentre-1.3,armY-4,rx*1.05,ry*.70),(L-11,armCentre-3.2,armY-15,rx*1.15,ry*.76),(L-3,armCentre-4.2,armY-23,rx*.9,ry*.62),(L,armCentre-4.5,armY-23.7,.35,.5)])
 def arm_mesh(sign,rows,material,name,core=False):
  ts=np.linspace(rows[0,0],rows[-1,0],max(12,int((rows[-1,0]-rows[0,0])*.9)));vals=PchipInterpolator(rows[:,0],rows[:,1:],axis=0)(ts)
  K=32;angles=np.arange(K)*2*np.pi/K;cos=np.sign(np.cos(angles))*abs(np.cos(angles))**.56;sin=np.sign(np.sin(angles))*abs(np.sin(angles))**.56
  pp=[];uvs=[]
  for t,(cx,cy,xx,yy) in zip(ts,vals):
   pp.extend(np.c_[sign*(cx+xx*cos),cy+yy*sin,np.full(K,-t)])
   for ca,sa in zip(cos,sin):
    outside=ca>0 and t<L-30;u=np.clip((t-8)/(L-40),0,1);v=(.5-.42*sa)/2 if outside else .5+(.5-.42*sa)/2;uvs.append([u,v])
  ff=[]
  for i in range(len(ts)-1):
   for j in range(K):
    aa=i*K+j;bb=i*K+(j+1)%K;ff.extend([[aa,bb,aa+K],[bb,bb+K,aa+K]])
  for j in range(1,K-1):ff.extend([[0,j+1,j],[(len(ts)-1)*K,(len(ts)-1)*K+j,(len(ts)-1)*K+j+1]])
  m.mesh(name+' '+str(sign),pp,ff,material,uv=uvs)
 for sign in [-1,1]:
  transparent=armTone in ['clear','champagne']
  if transparent:
   body=mat(armTone+' transparent acetate temple',COL[armTone],0,.12);arm_mesh(sign,rows,body,'Fitted temple transparent shell')
   coreRows=rows[:5].copy();coreRows[:,3]=.35;coreRows[:,4]=min(1.5,ry*.65);coreRows[:,1]+=.5
   arm_mesh(sign,coreRows,armmats[sign],'Fitted temple printed metal core')
  elif c.get('tip'):
   split=L-35;main=rows[rows[:,0]<=split];arm_mesh(sign,main,armmats[sign],'Fitted temple exterior')
   tipRows=rows[rows[:,0]>=split];tip=c['tip'];col=COL['navy' if tip=='navy-orange' else tip];tipmat=mat(tip+' acetate ear hook',col,0,.28)
   arm_mesh(sign,tipRows,tipmat,'Fitted temple ear hook')
   if tip=='navy-orange':
    end=tipRows[-3:].copy();orange=mat('Orange flexible end tip',COL['orange'],0,.35);arm_mesh(sign,end,orange,'Fitted temple orange end')
  else:arm_mesh(sign,rows,armmats[sign],'Fitted temple exterior')
  if c.get('core') and not transparent:
   wire=mat('Inner '+c['core']+' core',COL[c['core']],.8,.24)
   coreRows=rows[:5].copy();coreRows[:,3]=.35;coreRows[:,4]=1.0;arm_mesh(sign,coreRows,wire,'Fitted temple internal core')
  if c.get('hingeplate'):
   for t in np.linspace(10,17,6):tube('Gold hinge fluting '+str(sign),curve([(sign*(hx+1.8),armY-ry*.95,-t),(sign*(hx+1.8),armY+ry*.95,-t)],7),.2,.22,hardware)
  if c.get('medallion'):
   for t in [18,22]:
    p=np.c_[np.full(70,sign*(hx+3)),armY+np.sin(np.linspace(0,2*np.pi,70))*3.2,-t+np.cos(np.linspace(0,2*np.pi,70))*2.0]
    tube('Gold open side medallion '+str(sign),p,.42,.45,hardware,True)
  if c.get('rails') or c.get('filigree'):
   # Fine raised borders retain a physical highlight along the engraved side.
   for yoff in [-.65,.65]:
    p=curve([(sign*(hx+1.5),armY+yoff,-15),(sign*(hx+5.8),armY+yoff,-42),(sign*armCentre,armY+yoff,-80)],80)
    tube('Fitted temple raised rail '+str(sign),p,.12,.16,hardware)
 bridgeMetal=kind in ['metal','metal-brow','club']
 points=curve([(-c['bridge']/2-3,6,-.5),(-c['bridge']/2,8,0),(0,9,1.2),(c['bridge']/2,8,0),(c['bridge']/2+3,6,-.5)],70)
 if not customFront:tube('Saddle nose bridge',points,.85 if bridgeMetal else 2.8,1.0 if bridgeMetal else 2.2,hardware if bridgeMetal else frontmat,photoUV=not bridgeMetal)
 if c.get('double'):
  points=curve([(-c['width']*.75,15,-4),(-c['width']*.40,20,-2),(0,21,0),(c['width']*.40,20,-2),(c['width']*.75,15,-4)],90)
  tube('Upper double bridge',points,.65 if bridgeMetal else 1.4,.75 if bridgeMetal else 1.6,hardware if bridgeMetal else frontmat,photoUV=not bridgeMetal)
 if c.get('clip'):
  group=m.group('SunClip_Removable');clipmat=mat('Black magnetic clip acetate',COL['black'],0,.23);smoke=lensmat('dark')
  for sign in [-1,1]:
   # Keep the same product outline and curvature as the optical body.
   midp=(O+I)/2;outer=midp+(O-midp)*.9;inner=midp+(I-midp)*.55
   rim('Magnetic sun clip frame '+str(sign),sign,outer,inner,clipmat,depth=2,z=4.2,group=group)
   lens('Clip sun lens '+str(sign),inner,sign,smoke,group,z=4.7)
  tube('Clip bridge',points if False else curve([(-c['bridge']/2-1,7,4.6),(0,10,5),(c['bridge']/2+1,7,4.6)],50),1.2,1.1,clipmat,group=group)
  m.g['scenes'].append({'name':'Optical only','nodes':[len(m.g['nodes'])]});m.g['nodes'].append({'name':'OpticalOnly','children':[n for n in m.g['nodes'][0]['children'] if n!=group]})
 debug=photo.copy();dd=ImageDraw.Draw(debug);dd.line([tuple(v) for v in np.vstack([O,O[0]])],fill='red',width=2);dd.line([tuple(v) for v in np.vstack([I,I[0]])],fill='blue',width=2)
 bb=(max(0,int(O[:,0].min()-20)),max(0,int(O[:,1].min()-20)),min(800,int(O[:,0].max()+21)),min(600,int(O[:,1].max()+21)))
 (WORK/'traces').mkdir(exist_ok=True);debug.crop(bb).save(WORK/'traces'/(key+'.jpg'))
 path=m.save(key+'.glb')
 return {'id':key,'file':str(path),'frontWidthMm':fw,'anchor':bridgeAnchor,'meshes':len(m.g['meshes']),'bytes':path.stat().st_size,'source':'front source + arm source','repairedTraceSamples':int(bad.sum()),'photographicTextures':len(texmeta)}
if __name__=='__main__':
 keys=sys.argv[1:] or list(CONFIG)
 results=[]
 for key in keys:
  result=make(key,CONFIG[key]);results.append(result);print(json.dumps(result),flush=True)
 (WORK/'build-results.json').write_text(json.dumps(results,indent=2))
