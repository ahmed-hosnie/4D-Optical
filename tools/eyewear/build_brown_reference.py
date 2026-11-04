"""Reference-derived brown clip-on; contours and UVs traced from supplied photos.
These are estimated dimensions, not a measured manufacturer model.
"""
import numpy as np,cv2
from PIL import Image
from io import BytesIO
from pathlib import Path
from scipy.interpolate import PchipInterpolator
from collection import Model,curve
ROOT=Path(__file__).resolve().parents[2]
import collection
collection.OUT=ROOT/'models'
m=Model();m.kind='brown'
m.g['nodes'][0]['extras']={'frontWidthMm':139.5,'bridgeAnchorMm':4,'source':'Product photograph contours and photographic acetate textures; dimensions estimated.'}
def texture(im):
 b=BytesIO();im.save(b,'JPEG',quality=96,subsampling=0)
 while len(m.buf)%4:m.buf.append(0)
 vi=len(m.g['bufferViews']);m.g['bufferViews'].append(dict(buffer=0,byteOffset=len(m.buf),byteLength=len(b.getvalue())));m.buf.extend(b.getvalue())
 ims=m.g.setdefault('images',[]);ims.append({'bufferView':vi,'mimeType':'image/jpeg'})
 tex=m.g.setdefault('textures',[]);tex.append({'source':len(ims)-1});return len(tex)-1
bundle=Image.open(ROOT/'folder_3_80_images/real_clipon_tortoise_bundle.jpg').convert('RGB')
# Extend photographed acetate colour into empty pixels so bevels never sample
# the white background or a clear lens. No synthetic repeating tortoise pattern.
from scipy.ndimage import distance_transform_edt
def extend_acetate(a):
 hsv=cv2.cvtColor(a,cv2.COLOR_RGB2HSV)
 valid=(hsv[:,:,1]>45)&(a[:,:,0].astype(float)>a[:,:,1]*1.04)
 _,idx=distance_transform_edt(~valid,return_indices=True)
 return a[tuple(idx)]
frontimage=np.array(bundle).copy()
frontimage[284:460,128:636]=extend_acetate(frontimage[284:460,128:636])
fronttex=texture(Image.fromarray(frontimage))
macro=np.array(Image.open(ROOT/'folder_3_80_images/real_clipon_tortoise_macro.jpg').convert('RGB'))
# Actual exterior arm, including the product's serif gold wordmark.
H=cv2.getPerspectiveTransform(np.float32([[439,283],[732,205],[745,246],[439,341]]),np.float32([[0,0],[1535,0],[1535,255],[0,255]]))
arm=extend_acetate(cv2.warpPerspective(macro,H,(1536,256),flags=cv2.INTER_CUBIC))
# An unprinted side for the inside face and the ear hook, sampled from the same arm.
plain=cv2.resize(arm[:,1090:1420],(1536,256),interpolation=cv2.INTER_CUBIC)
atlas=np.concatenate([arm,plain],axis=0)
armtex=texture(Image.fromarray(atlas))
# Reverse only the wordmark panel on the opposite outside arm, keeping it by the hinge.
armleft=arm.copy();armleft[:,25:930]=armleft[:,25:930][:,::-1]
armtexleft=texture(Image.fromarray(np.concatenate([armleft,plain],axis=0)))
def mat(name,tex,rough=.22):
 i=m.mat(name,[1,1,1,1],0,rough);m.g['materials'][i]['pbrMetallicRoughness']['baseColorTexture']={'index':tex};return i
front=mat('Photographic amber acetate front',fronttex)
armmat={1:mat('Amber acetate exterior arm right',armtex),-1:mat('Amber acetate exterior arm left',armtexleft)}
gold=m.mat('Champagne gold hinge hardware',[.68,.52,.27,1],.8,.23)
steel=m.mat('Steel hinge pins',[.34,.32,.26,1],.8,.24)
optical=m.mat('Clear optical lens',[.89,.94,.98,.08],0,.07)
smoke=m.mat('Neutral smoke sun lens',[.025,.028,.030,.73],0,.11)
for i in [optical,smoke]:
 m.g['materials'][i]['doubleSided']=False
 m.g['materials'][i]['extensions']={'KHR_materials_clearcoat':{'clearcoatFactor':1,'clearcoatRoughnessFactor':.08}}
# Pixel contours of the right optical rim in the straight-on bundle photograph.
O=np.array([(408,329),(415,312),(444,298),(480,290),(522,293),(563,300),(598,305),(627,310),(629,320),(627,331),(611,343),(609,369),(599,403),(585,428),(559,446),(529,454),(496,454),(464,446),(442,429),(425,405),(414,376),(408,349)],float)
I=np.array([(420,346),(425,327),(437,314),(463,305),(498,302),(535,306),(568,315),(590,330),(594,351),(588,382),(578,406),(562,425),(539,436),(510,442),(480,438),(455,426),(438,406),(426,379)],float)
# Match inner and outer rings by polar angle rather than arbitrary spline indices.
def radial(poly,center,N=240):
 p=curve(poly,2000,True);d=p-center;a=np.arctan2(d[:,1],d[:,0]);order=np.argsort(a);a=a[order];r=np.linalg.norm(d[order],axis=1)
 theta=np.arange(N)*2*np.pi/N-np.pi
 rr=np.interp(theta,np.r_[a[-1]-2*np.pi,a,a[0]+2*np.pi],np.r_[r[-1],r,r[0]])
 return center+rr[:,None]*np.c_[np.cos(theta),np.sin(theta)]
center=np.array([505,371]);outer=radial(O,center);inner=radial(I,center)
S=.28;CX=382;CY=346
def xyz(p,sign,z=0):
 x=(p[:,0]-CX)*S
 return np.c_[sign*x,(CY-p[:,1])*S,-3.4*(x/69.5)**2+z]
def uv(p):return np.c_[p[:,0]/bundle.width,p[:,1]/bundle.height]
def rim(name,sign,outer,inner,mat,z=0,group=0):
 # A broad acetate slab with rolled bevels, rather than a round wire tube.
 profile=[(0,-1.8),(0,-.25),(.07,.85),(.20,1.4),(.80,1.4),(.95,.95),(1,.1),(1,-1.8),(.92,-2.3),(.08,-2.3)]
 ps=[];uvs=[];N=len(outer)
 for t,dz in profile:
  p=inner+(outer-inner)*t;ps.extend(xyz(p,sign,z+dz))
  # Pull texture sampling off white lens/background edges into the actual acetate.
  q=inner+(outer-inner)*(.16+.68*t);uvs.extend(uv(q))
 fs=[]
 for j in range(len(profile)):
  for k in range(N):
   a=j*N+k;b=j*N+(k+1)%N;c=((j+1)%len(profile))*N+k;d=((j+1)%len(profile))*N+(k+1)%N;fs.extend([[a,b,c],[b,d,c]])
 m.mesh(name,ps,fs,mat,group,uv=uvs)
def solid(name,outline,mat,sign=1,z=0,group=0):
 # Rounded extruded polygon for the saddle bridge and end pieces.
 p=curve(outline,100,True);c=p.mean(0);ps=[];uvs=[];N=len(p)
 for shrink,dz in [(.95,-2.3),(1,-1.5),(1,.5),(.96,1.35)]:
  q=c+(p-c)*shrink;ps.extend(xyz(q,sign,z+dz));uvs.extend(uv(c+(q-c)*.94))
 fs=[]
 for j in range(3):
  for k in range(N):
   a=j*N+k;b=j*N+(k+1)%N;fs.extend([[a,b,a+N],[b,b+N,a+N]])
 for k in range(1,N-1):fs.extend([[0,k+1,k],[3*N,3*N+k,3*N+k+1]])
 m.mesh(name,ps,fs,mat,group,uv=uvs)
def lens(name,outline,material,group=0,z=0):
 # One convex front sheet avoids blending front+back into an opaque flat blob.
 N=len(outline);c=outline.mean(0);p=[c+[0,0,z+.85]];f=[]
 for t in np.linspace(.08,1,14):
  q=c+(outline-c)*t;q[:,2]+=z+.85*(1-t*t);p.extend(q)
 f.extend([[0,1+j,1+(j+1)%N] for j in range(N)])
 for i in range(13):
  for j in range(N):
   a=1+i*N+j;b=1+i*N+(j+1)%N;f.extend([[a,a+N,b],[b,a+N,b+N]])
 # A separate left lens must keep its front normals pointing toward +Z.
 p=np.array(p);f=np.array(f);cross=np.cross(p[f[:,1]]-p[f[:,0]],p[f[:,2]]-p[f[:,0]])
 if cross[:,2].sum()<0:f=f[:,::-1]
 # Model.mesh's closed-volume orientation heuristic does not apply to open sheets.
 shifted=p.copy();shifted[:,2]+=100
 m.mesh(name,shifted,f,material,group)
 node=m.g['nodes'][-1];node['translation']=[0,0,-.1]
for sign in [1,-1]:
 rim('Bevelled optical rim '+str(sign),sign,outer,inner,front)
 lens('Clear optical lens '+str(sign),xyz(inner,sign),optical)
 # The arms open out around the temples rather than running through the head mask.
 rows=np.array([(5,68.8,7.7,1.7,4.6),(12,70,7.7,1.8,4.7),(35,74.5,7.6,1.75,4.4),(75,77.0,7.6,1.6,3.7),(102,76.5,7.0,1.6,3.1),(114,75.5,5.0,1.8,3.1),(128,73,-5.0,2.1,3.5),(140,70.5,-15.5,2.3,3.6),(146,69.8,-17,0.5,0.8)])
 ts=np.linspace(rows[0,0],rows[-1,0],190);vals=PchipInterpolator(rows[:,0],rows[:,1:],axis=0)(ts);N=36;a=np.arange(N)*2*np.pi/N
 cs=np.sign(np.cos(a))*abs(np.cos(a))**.5;sn=np.sign(np.sin(a))*abs(np.sin(a))**.5
 pp=[];uvs=[]
 for t,(cx,cy,rx,ry) in zip(ts,vals):
  pp.extend(np.c_[sign*(cx+rx*cs),cy+ry*sn,np.full(N,-t)])
  for ca,sa in zip(cs,sn):
   exterior=ca>0 and t<110
   u=np.clip((t-7)/100,0,1) if exterior else np.clip(t/146,0,1)
   v=(.5-.42*sa)/2 if exterior else .5+(.5-.42*sa)/2
   uvs.append([u,v])
 ff=[]
 for i in range(len(ts)-1):
  for j in range(N):
   k=i*N+j;b=i*N+(j+1)%N;ff.extend([[k,b,k+N],[b,b+N,k+N]])
 for j in range(1,N-1):ff.extend([[0,j+1,j],[(len(ts)-1)*N,(len(ts)-1)*N+j,(len(ts)-1)*N+j+1]])
 m.mesh('Splayed full acetate arm '+str(sign),pp,ff,armmat[sign],uv=uvs)
 for zz in [-5,-9]:m.tube('Metal hinge barrel '+str(sign),curve([(sign*68.1,5,zz),(sign*68.1,10,zz)],8),.9,.9,gold)
 m.tube('Front champagne rivet '+str(sign),curve([(sign*63.1,6.6,0),(sign*66,6.6,-.2)],12),.55,.4,gold)
solid('Keyhole saddle bridge',[(344,318),(360,312),(385,315),(403,313),(421,319),(420,342),(408,344),(400,335),(385,332),(367,334),(357,344),(346,342)],front)
clip=m.group('SunClip_Removable');m.g['nodes'][clip]['extras']={'toggle':'Detach sun clip to show clear optical lenses'}
for sign in [1,-1]:
 # Matching outline and 3D curvature; a separate thin magnetic rim sits in front.
 c=(outer+inner)/2
 co=c+(outer-c)*.90;ci=c+(inner-c)*.45
 rim('Thin magnetic clip rim '+str(sign),sign,co,ci,front,z=4.0,group=clip)
 lens('Neutral smoke sun lens '+str(sign),xyz(ci,sign),smoke,clip,z=4.3)
 m.tube('Magnetic rivet '+str(sign),curve([(sign*63,6.6,4.8),(sign*65.6,6.6,4.6)],12),.5,.4,gold,group=clip)
solid('Clip saddle bridge',[(350,321),(368,316),(385,318),(402,316),(418,322),(416,334),(404,333),(384,328),(364,332),(352,335)],front,z=4,group=clip)
# An alternative scene is convenient for standalone GLB viewers.
m.g['scenes'].append({'name':'Optical only','nodes':[len(m.g['nodes'])]})
m.g['nodes'].append({'name':'OpticalOnly','children':[i for i in m.g['nodes'][0]['children'] if i!=clip]})
path=m.save('4D-Optical-Brown-Clip.glb')
(ROOT/'models'/path.name).write_bytes(path.read_bytes())
print(path,path.stat().st_size)
