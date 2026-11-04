import numpy as np,json,struct
from pathlib import Path
from scipy.interpolate import CubicSpline,PchipInterpolator
from PIL import Image,ImageFont,ImageDraw
from io import BytesIO
OUT=Path('models');OUT.mkdir(exist_ok=True)
def curve(pts,k,loop=False):
 a=np.array(pts,float)
 if loop:a=np.vstack([a,a[0]])
 t=np.r_[0,np.cumsum(np.linalg.norm(np.diff(a,axis=0),axis=1))]
 return CubicSpline(t,a,bc_type='periodic' if loop else 'natural')(np.linspace(0,t[-1],k,endpoint=not loop))
class Model:
 def __init__(self):
  self.g={'asset':{'version':'2.0','generator':'4D Optical reference-based model'},'scene':0,'scenes':[{'name':'Eyewear','nodes':[0]}],'nodes':[{'name':'NoseBridgeAnchor','children':[]}],'meshes':[],'materials':[],'accessors':[],'bufferViews':[]}
  self.buf=bytearray()
 def mat(self,name,col,metal=0,rough=.28):
  m={'name':name,'doubleSided':True,'pbrMetallicRoughness':dict(baseColorFactor=col,roughnessFactor=rough,metallicFactor=metal)}
  if col[-1]<1:m['alphaMode']='BLEND'
  self.g['materials'].append(m);return len(self.g['materials'])-1
 def acc(self,a,target):
  a=np.ascontiguousarray(a);n=1 if a.ndim==1 else a.shape[1]
  while len(self.buf)%4:self.buf.append(0)
  v=len(self.g['bufferViews']);self.g['bufferViews'].append(dict(buffer=0,byteOffset=len(self.buf),byteLength=a.nbytes,target=target));self.buf.extend(a.tobytes())
  rec=dict(bufferView=v,componentType=5126 if a.dtype.kind=='f' else 5125,count=len(a),type={1:'SCALAR',2:'VEC2',3:'VEC3',4:'VEC4'}[n])
  if n==3:rec.update(min=a.min(0).tolist(),max=a.max(0).tolist())
  self.g['accessors'].append(rec);return len(self.g['accessors'])-1
 def mesh(self,name,p,f,mat,group=0,uv=None,marble=False):
  p=np.array(p,float);f=np.array(f,'uint32')
  vol=np.sum(np.einsum('ij,ij->i',p[f[:,0]],np.cross(p[f[:,1]],p[f[:,2]])))
  if vol<0:f=f[:,::-1]
  normals=np.zeros_like(p);fn=np.cross(p[f[:,1]]-p[f[:,0]],p[f[:,2]]-p[f[:,0]])
  for j in range(3):np.add.at(normals,f[:,j],fn)
  normals/=np.maximum(np.linalg.norm(normals,axis=1)[:,None],1e-18)
  attributes={'POSITION':self.acc((p*.001).astype('float32'),34962),'NORMAL':self.acc(normals.astype('float32'),34962)}
  if uv is not None:attributes['TEXCOORD_0']=self.acc(np.array(uv,'float32'),34962)
  if marble:
   if not hasattr(self,'tortoise_texture'):
    yy,xx=np.mgrid[0:1024,0:1024]/1024
    pat=np.sin(xx*41+2.1*np.sin(yy*37))*np.cos(yy*32+1.9*np.sin(xx*33))+.5*np.sin(xx*79+yy*51)
    v=(.5+.5*np.tanh(pat*1.7))[:,:,None]
    col=np.array([62,23,7])*(1-v)+np.array([161,72,15])*v
    im=Image.fromarray(np.uint8(col),'RGB');b=BytesIO();im.save(b,'PNG')
    while len(self.buf)%4:self.buf.append(0)
    vi=len(self.g['bufferViews']);self.g['bufferViews'].append(dict(buffer=0,byteOffset=len(self.buf),byteLength=len(b.getvalue())));self.buf.extend(b.getvalue())
    images=self.g.setdefault('images',[]);images.append({'bufferView':vi,'mimeType':'image/png'})
    tex=self.g.setdefault('textures',[]);tex.append({'source':len(images)-1});self.tortoise_texture=len(tex)-1
   self.g['materials'][mat]['pbrMetallicRoughness']['baseColorTexture']={'index':self.tortoise_texture}
   uv=np.c_[p[:,0]*.012+p[:,2]*.009,p[:,1]*.018+p[:,2]*.003]
   attributes['TEXCOORD_0']=self.acc(uv.astype('float32'),34962)
  idx=len(self.g['meshes']);self.g['meshes'].append({'name':name,'primitives':[{'attributes':attributes,'indices':self.acc(f.flatten(),34963),'material':mat}]})
  node=len(self.g['nodes']);self.g['nodes'].append({'name':name,'mesh':idx});self.g['nodes'][group]['children'].append(node)
 def group(self,name):
  idx=len(self.g['nodes']);self.g['nodes'].append({'name':name,'children':[]});self.g['nodes'][0]['children'].append(idx);return idx
 def tube(self,name,p,r,d,mat,loop=False,group=0,marble=False):
  p=np.array(p);n=40
  tang=np.roll(p,-1,0)-np.roll(p,1,0)
  if not loop:tang[0]=p[1]-p[0];tang[-1]=p[-1]-p[-2]
  tang/=np.linalg.norm(tang,axis=1)[:,None]
  # Transport a stable frame for each direction.
  ref=np.tile([0.,0.,1.],(len(p),1));ref[abs(tang[:,2])>.85]=[1,0,0]
  u=np.cross(tang,ref);u/=np.linalg.norm(u,axis=1)[:,None];v=np.cross(tang,u)
  a=np.arange(n)*2*np.pi/n
  rr=np.broadcast_to(r,(len(p),))[:,None,None];dd=np.broadcast_to(d,(len(p),))[:,None,None]
  roundness=.67 if any(x in self.g['materials'][mat]['name'].lower() for x in ['acetate','midnight','tortoise']) else 1
  cc=np.sign(np.cos(a))*abs(np.cos(a))**roundness;ss=np.sign(np.sin(a))*abs(np.sin(a))**roundness
  verts=(p[:,None]+rr*u[:,None]*cc[None,:,None]+dd*v[:,None]*ss[None,:,None]).reshape(-1,3)
  faces=[]
  for i in range(len(p) if loop else len(p)-1):
   for j in range(n):
    aa=i*n+j;bb=i*n+(j+1)%n;cc=((i+1)%len(p))*n+j;ee=((i+1)%len(p))*n+(j+1)%n
    faces.extend([[aa,bb,cc],[bb,ee,cc]])
  if not loop:
   for j in range(1,n-1):faces.extend([[0,j+1,j],[(len(p)-1)*n,(len(p)-1)*n+j,(len(p)-1)*n+j+1]])
  self.mesh(name,verts,faces,mat,group,marble=marble)
 def lens(self,name,outline,mat,offset=0,group=0):
  c=outline.mean(0);N=len(outline);p=[];f=[]
  for back in [False,True]:
   base=len(p);p.append(c+np.array([0,0,offset+.9-(.6 if back else 0)]))
   for t in np.linspace(.06,1,24):
    q=c+(outline-c)*t;q[:,2]+=offset+.9*(1-t*t)-(.6 if back else 0);p.extend(q)
   faces=[[base,base+1+j,base+1+(j+1)%N] for j in range(N)]
   for i in range(23):
    for j in range(N):
     a=base+1+i*N+j;b=base+1+i*N+(j+1)%N;faces.extend([[a,a+N,b],[b,a+N,b+N]])
   if back:faces=[x[::-1] for x in faces]
   f.extend(faces)
  layer=1+24*N
  for j in range(N):
   a=1+23*N+j;b=1+23*N+(j+1)%N;f.extend([[a,b,a+layer],[b,b+layer,a+layer]])
  self.mesh(name,p,f,mat,group)
 def temple(self,name,sign,rows,mat,marble=False):
  rows=np.array(rows,float);ts=np.linspace(rows[0,0],rows[-1,0],200);vals=PchipInterpolator(rows[:,0],rows[:,1:],axis=0)(ts)
  n=56;a=np.arange(n)*2*np.pi/n
  cs=np.sign(np.cos(a))*abs(np.cos(a))**.55;sn=np.sign(np.sin(a))*abs(np.sin(a))**.55
  pp=[]
  for t,(cx,cy,rx,ry) in zip(ts,vals):pp.extend(np.c_[sign*(cx+rx*cs),cy+ry*sn,np.full(n,-t)])
  ff=[]
  for i in range(len(ts)-1):
   for j in range(n):
    aa=i*n+j;b=i*n+(j+1)%n;ff.extend([[aa,b,aa+n],[b,b+n,aa+n]])
  for j in range(1,n-1):ff.extend([[0,j+1,j],[(len(ts)-1)*n,(len(ts)-1)*n+j,(len(ts)-1)*n+j+1]])
  self.mesh(name,pp,ff,mat,marble=marble)
 def text(self,sign,start,length,y,side_x,color,label='4D OPTICAL',height=3.1):
  from matplotlib.textpath import TextPath
  from matplotlib.font_manager import FontProperties
  from matplotlib.path import Path as MPath
  from scipy.spatial import Delaunay
  font='/usr/share/fonts/opentype/urw-base35/NimbusRoman-Regular.otf'
  if getattr(self,'kind','')=='navy':font='/usr/share/fonts/opentype/urw-base35/NimbusSansNarrow-Regular.otf'
  contours=TextPath((0,0),label,size=12,prop=FontProperties(fname=font)).to_polygons()
  pts=np.vstack(contours);pp=np.unique(np.round(pts,5),axis=0)
  tri=Delaunay(pp).simplices
  def inside(pts):
   hits=np.zeros(len(pts),int)
   for c in contours:hits+=MPath(c).contains_points(pts)
   return hits%2==1
  centers=pp[tri].mean(1)
  keep=inside(centers)
  for k in range(3):keep&=inside(.49*pp[tri[:,k]]+.49*pp[tri[:,(k+1)%3]]+.02*centers)
  faces=tri[keep]
  low=pp.min(0);span=pp.max(0)-low
  xx=(pp[:,0]-low[0])/span[0];yy=(pp[:,1]-low[1])/span[1]-.5
  t=start+length*(xx if sign>0 else 1-xx)
  p=np.c_[sign*np.array([side_x(v)+.07 for v in t]),np.array([y(v) for v in t])+yy*height,-t]
  mat=self.mat('Gold printed wordmark',list(color)+[1],.25,.33)
  self.mesh('4D OPTICAL lettering '+str(sign),p,faces,mat)
 def save(self,name):
  self.g['extensionsUsed']=['KHR_materials_clearcoat','KHR_materials_ior']
  for mat in self.g['materials']:
   label=mat['name'].lower()
   if any(x in label for x in ['acetate','tortoise','orange','crystal']):
    mat['extensions']={'KHR_materials_clearcoat':{'clearcoatFactor':.45,'clearcoatRoughnessFactor':.19},'KHR_materials_ior':{'ior':1.48}}
  self.g['buffers']=[{'byteLength':len(self.buf)}];js=json.dumps(self.g,separators=(',',':')).encode();js+=b' '*(-len(js)%4);self.buf+=bytes(-len(self.buf)%4)
  out=struct.pack('<4sII',b'glTF',2,28+len(js)+len(self.buf))+struct.pack('<I4s',len(js),b'JSON')+js+struct.pack('<I4s',len(self.buf),b'BIN\0')+self.buf
  path=OUT/name;path.write_bytes(out);assert struct.unpack_from('<I',out,8)[0]==len(out)
  return path

SHAPES={
 'brown':[(9,6),(13,15),(25,20),(39,19),(51,15),(57,8),(57,-5),(53,-18),(45,-26),(31,-28),(20,-24),(13,-15)],
 'clear':[(9,7),(13,15),(27,18),(43,18),(55,15),(59,10),(58,-2),(54,-17),(47,-24),(33,-26),(20,-24),(13,-14)],
 'gold':[(8,4),(11,14),(20,19),(35,18),(50,15),(58,9),(59,-3),(55,-19),(46,-29),(30,-30),(18,-25),(11,-13)],
 'navy':[(8,5),(12,14),(24,19),(40,19),(52,16),(58,12),(58,0),(54,-17),(46,-24),(30,-25),(19,-22),(12,-13)],
 'club':[(9,8),(15,15),(29,19),(44,18),(56,13),(60,5),(58,-9),(53,-21),(44,-28),(28,-29),(17,-23),(11,-10)]
}
def make(kind,name):
 m=Model();m.kind=kind
 gold=m.mat('Brushed warm gold',[.79,.58,.25,1],.88,.23)
 core=m.mat('Steel hinge and wire',[.43,.43,.40,1],.88,.25)
 clear=m.mat('Clear optical lenses',[.82,.91,1,.09],0,.08)
 if kind=='brown':frame=m.mat('Amber tortoiseshell',[1,1,1,1],.03,.2)
 elif kind=='clear':frame=m.mat('Crystal transparent acetate',[.88,.94,.95,.32],.03,.11)
 elif kind=='gold':frame=gold
 elif kind=='navy':frame=m.mat('Matte midnight blue',[.006,.013,.033,1],0,.40)
 else:frame=m.mat('Polished black acetate',[.006,.007,.009,1],0,.17)
 orange=m.mat('Translucent orange temple',[1,.29,.016,.72],0,.24)
 black=m.mat('Black clip acetate',[.008,.009,.011,1],.03,.22)
 smoke=m.mat('Smoke sun lenses',[.035,.045,.056,.97],.09,.14)
 green=m.mat('Dark green lenses',[.045,.077,.053,.98],.08,.18)
 pad=m.mat('Soft clear nose pads',[.84,.8,.65,.35],0,.23)
 depth=lambda x:-6*(x/63)**2
 P=curve(SHAPES[kind],256,True)
 for sign in [1,-1]:
  p=np.c_[sign*P[:,0],P[:,1],depth(P[:,0])]
  r=.9 if kind=='gold' else 1.05 if kind=='club' else 2.15 if kind=='brown' else 1.9 if kind=='clear' else 2.7
  m.tube('Full frame rim '+str(sign),p,r,1 if kind in ['gold','club'] else 2.4,frame if kind!='club' else gold,True,marble=kind=='brown')
  m.lens('Lens '+str(sign),p,green if kind=='club' else clear)
  if kind=='club':
   brow=curve([(9,9),(13,15),(25,20),(42,20),(55,16),(62,12),(64,6)],100);brow[:,0]*=sign;brow=np.c_[brow,depth(brow[:,0])+1.2]
   m.tube('Thick black brow '+str(sign),brow,np.linspace(2.7,3.2,len(brow)),2.3,frame)
  hinge_x=64 if kind in ['gold','club'] else 62
  hx=hinge_x
  m.tube('Hinge connector '+str(sign),curve([(sign*56,12,depth(56)),(sign*hx,12,-7),(sign*(hx+1),12,-14)],32),1.4,1.5,frame if kind not in ['gold'] else gold,marble=kind=='brown')
  if kind=='gold':
   path=curve([(sign*64,12,-10),(sign*66,12,-45),(sign*67,12,-95),(sign*66,9,-114),(sign*64,-4,-136)],160)
   m.tube('Slim golden temple '+str(sign),path,.85,1.2,gold)
   m.tube('Flattened gold endtip '+str(sign),path[-24:],1.8,1.1,gold)
   # Engraved rails beside the hinge.
   for dy in [-.55,.55]:
    line=curve([(sign*65.3,12+dy,-14),(sign*66,12+dy,-38),(sign*66.6,12+dy,-60)],80);m.tube('Temple engraved rail',line,.15,.15,core)
  else:
   rows=[(12,hx+1,12,1.7,3.4),(18,hx+1.2,12,1.8,3.3),(60,hx+2.5,11.5,1.7,2.9),(91,hx+3,11.4,1.65,2.6),(103,hx+2.5,9.2,1.7,2.7),(115,hx+1,-.5,1.85,3.0),(128,hx-1.5,-12,2,2.8),(132,hx-2,-13.8,.4,.6)]
   if kind=='navy':
    m.temple('Orange transparent straight temple '+str(sign),sign,rows[:3]+[(94,hx+3,11.2,1.65,2.6)],orange)
    m.temple('Navy flexible hook '+str(sign),sign,[(94,hx+3,11.2,1.65,2.6)]+rows[4:6]+[(127,hx-1.5,-11,2,2.8)],frame)
    m.temple('Orange endtip '+str(sign),sign,[(126,hx-1.3,-10.5,2,2.8),rows[-1]],orange)
   else:m.temple('Curved temple '+str(sign),sign,rows,frame,marble=kind=='brown')
   m.text(sign,23,25,lambda t:12-(t-18)*.008,lambda t:hx+3.1+(t-18)*.032,[.82,.68,.36] if kind in ['brown','club'] else [.13,.13,.14] if kind=='navy' else [.78,.66,.37],height=2.8)
   if kind=='clear':
    path=curve([(sign*(hx+1.1),12,-15),(sign*(hx+2.4),11.5,-65),(sign*(hx+2.7),10,-102)],100)
    m.tube('Visible silver temple core '+str(sign),path,.6,.9,core)
  if kind in ['gold','club']:
   support=curve([(sign*10,2,-1),(sign*8,-2,-5),(sign*8,-6,-7)],40)
   m.tube('Nosepad support '+str(sign),support,.55,.55,gold)
   ellipse=curve([(sign*8,-1,-7),(sign*8,-4,-8),(sign*8,-9,-7)],32)
   m.tube('Silicone nosepad '+str(sign),ellipse,2.1,.9,pad)
  if kind in ['brown','club']:
   path=curve([(sign*55.5,12,depth(56)+2.4),(sign*59,12,depth(59)+2.4)],18)
   m.tube('Gold rivet '+str(sign),path,.7,.5,gold)
 # Anatomical bridge, positioned clear of the lens openings.
 if kind in ['gold','club']:
  bridge=curve([(-10,7,-.5),(-6,9,1),(0,9,1.5),(6,9,1),(10,7,-.5)],70)
  m.tube('Metal bridge',bridge,.9,1.1,gold)
 else:
  bridge=curve([(-12,9,-.2),(-8,8,0),(0,7,1),(8,8,0),(12,9,-.2)],70)
  m.tube('Acetate saddle bridge',bridge,3,2.4,frame,marble=kind=='brown')
 if kind=='gold':
  bar=curve([(-44,18,-6),(-24,22,-4),(0,23,-2),(24,22,-4),(44,18,-6)],120)
  m.tube('Double brow bar',bar,.65,.7,gold)
 if kind in ['clear','brown']:
  group=m.group('SunClip_Removable')
  m.g['nodes'][group]['extras']={'toggle':'Set visible false to remove sun clip'}
  for sign in [1,-1]:
   p=np.c_[sign*P[:,0],P[:,1],depth(P[:,0])+5.4]
   m.tube('Clip-on rim '+str(sign),p,1.5,1.25,black if kind=='clear' else frame,True,group,marble=kind=='brown')
   m.lens('Clip sun lens '+str(sign),p,smoke,group=group)
   pin=curve([(sign*55,12,depth(55)+6.4),(sign*57,12,depth(57)+6.4)],16)
   m.tube('Magnetic clip rivet',pin,.7,.5,gold if kind=='brown' else core,group=group)
  bridge=curve([(-10,9,5.5),(-5,10,6),(0,9,6),(5,10,6),(10,9,5.5)],60)
  m.tube('Clip bridge',bridge,1.4,1.3,black if kind=='clear' else frame,group=group,marble=kind=='brown')
  # Two ready-made scenes support product switching without reloading the asset.
  m.g['scenes']=[{'name':'With sun clip','nodes':[0]},{'name':'Optical only','nodes':[len(m.g['nodes'])]}]
  m.g['nodes'].append({'name':'OpticalOnly','children':[n for n in m.g['nodes'][0]['children'] if n!=group]})
 return m.save(name)

if __name__=='__main__':
 for kind,name in [('brown','4D-Optical-Brown-Clip.glb'),('clear','4D-Optical-Clear-Clip.glb'),('gold','4D-Optical-Gold-DoubleBridge.glb'),('navy','4D-Optical-Kids-Navy-Orange.glb'),('club','4D-Optical-Clubmaster-Black-Gold.glb')]:
  print(make(kind,name))
