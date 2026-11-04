import json,sys,numpy as np,cv2
from scipy.optimize import minimize
ROOT='/tmp/w/4D-Optical/'
import os
NOMIN=float(os.environ.get('NOMIN',2.2));NIMIN=float(os.environ.get('NIMIN',2.2))
A=json.load(open('/tmp/annotations_v4_backup.json'))
def mask_of(img,thr=48):
    h,w=img.shape[:2]; border=np.vstack([img[:12].reshape(-1,3),img[-12:].reshape(-1,3),img[:,:12].reshape(-1,3),img[:,-12:].reshape(-1,3)])
    bg=np.median(border,0); d=np.abs(img.astype(float)-bg).max(2)
    m=(d>thr).astype(np.uint8); m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8)); return m
def superellipse(n,N=96):
    t=np.linspace(0,2*np.pi,N,endpoint=False); c,s=np.cos(t),np.sin(t)
    return np.sign(c)*np.abs(c)**(2/n),np.sign(s)*np.abs(s)**(2/n)
def shape(p,N=96):
    tx,ty,a,b,c,d,no,ni,tap,tt,tb,ts1,ts2=p
    u,v=superellipse(max(2.2,no),N); uo=u*(1+tap*v); vo=v
    ui,vi=superellipse(max(2.2,ni),N)
    x0,x1=-(1-ts1),(1-ts2); y0,y1=-(1-tb),(1-tt)
    uin=(x0+x1)/2+(x1-x0)/2*ui*(1+tap*(vi*(y1-y0)/2+(y0+y1)/2)); vin=(y0+y1)/2+(y1-y0)/2*vi
    f=lambda U,V:np.c_[tx+a*U+b*V,ty+c*U+d*V]
    return f(uo,vo),f(uin,vin)
def fit(key,verbose=True):
    cfg=A[key]; img=cv2.resize(cv2.imread(ROOT+cfg['photo']),(800,600)); M=mask_of(img)
    O0=np.array(cfg['outer'],float); I0=np.array(cfg['inner'],float)
    roi=np.zeros((600,800),np.uint8); cv2.fillPoly(roi,[O0.astype(np.int32)],1); roi=cv2.dilate(roi,np.ones((13,13),np.uint8))
    c0=I0.mean(0); Is=(c0+(I0-c0)*.80).astype(np.int32); dc=np.zeros((600,800),np.uint8); cv2.fillPoly(dc,[Is],1)
    T=(M*roi*(1-dc)).astype(bool)
    rect=cv2.minAreaRect(O0.astype(np.float32)); center=O0.mean(0)
    w,h=np.ptp(O0[:,0])/2,np.ptp(O0[:,1])/2
    rad=np.radians(cfg['roll']); 
    p0=np.array([center[0],center[1],w,0,0,-h, 4.0,4.0,0.0,.22,.14,.18,.18])
    ys,xs=np.where(roi); y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    Tc=T[y0:y1,x0:x1]; Rc=roi[y0:y1,x0:x1].astype(bool)
    def render(p):
        O,I=shape(p); band=np.zeros((y1-y0,x1-x0),np.uint8)
        cv2.fillPoly(band,[np.round((O-[x0,y0])*16).astype(np.int32)],1,cv2.LINE_8,4)
        cv2.fillPoly(band,[np.round((I-[x0,y0])*16).astype(np.int32)],0,cv2.LINE_8,4)
        return band.astype(bool),O,I
    def loss(p):
        if p[6]<NOMIN or p[7]<NIMIN or p[6]>12 or p[7]>12 or min(p[9:])<.04 or max(p[9:])>.45 or abs(p[8])>.03 or abs(p[11]-p[12])>.02: return 5
        band,O,I=render(p)
        # shape inside ROI: penalise rim pixels outside the photographed frame and missed frame pixels
        inter=(band&Tc).sum(); uni=((band&Rc)|Tc).sum()
        ex=(band&~Rc).sum()
        reg=.002*(abs(p[8])*10)
        return 1-inter/max(uni,1)+0.5*ex/max(band.sum(),1)+reg
    best=None
    rng=np.random.default_rng(1)
    for r in range(6):
        p=p0.copy()
        if r: p[6:]+=rng.normal(0,.5,len(p)-6)*np.array([1,1,.05,.02,.02,.03,.03])
        res=minimize(loss,p,method='Powell',options={'maxiter':6000,'xtol':1e-2,'ftol':1e-5})
        if best is None or res.fun<best.fun: best=res
    O,I=shape(best.x)
    if verbose: print(key,'loss',round(best.fun,3),'n',best.x[6:8].round(2),'taper',round(best.x[8],3),'rim t/b/s',best.x[9:].round(3))
    return O,I,best.fun,img,M
if __name__=='__main__':
    keys=sys.argv[1:]; out={}; tiles=[]
    for k in keys:
        O,I,l,img,M=fit(k)
        out[k]={'outer':np.round(O,1).tolist(),'inner':np.round(I,1).tolist(),'loss':float(l)}
        ov=img.copy()
        cfg=A[k]
        cv2.polylines(ov,[np.round(np.array(cfg['outer'])).astype(np.int32)],True,(0,200,255),1)  # old = orange
        cv2.polylines(ov,[np.round(O).astype(np.int32)],True,(0,0,255),2); cv2.polylines(ov,[np.round(I).astype(np.int32)],True,(255,0,0),2)
        x0,y0=np.clip(O.min(0)-40,0,None).astype(int); x1,y1=np.clip(O.max(0)+40,0,[800,600]).astype(int)
        tiles.append(cv2.resize(ov[y0:y1,x0:x1],(420,int(420*(y1-y0)/(x1-x0)))))
    json.dump(out,open('/tmp/refined.json','w'))
    H=max(t.shape[0] for t in tiles); tiles=[cv2.copyMakeBorder(t,0,H-t.shape[0],0,0,cv2.BORDER_CONSTANT,value=(255,255,255)) for t in tiles]
    rows=[np.hstack(tiles[i:i+3]+[np.full((H,420,3),255,np.uint8)]*(3-len(tiles[i:i+3]))) for i in range(0,len(tiles),3)]
    cv2.imwrite('/tmp/refine_overlay.jpg',np.vstack(rows))
