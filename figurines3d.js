/* Azeroth Chess V12: fixed homogeneous projection and centered cell-safe figures. */
(()=>{'use strict';let yaw=0,gl,program,buffer,canvas,failed=false;const TAU=Math.PI*2;let verts=[];
function tri(a,b,c,col){let u=b.map((v,i)=>v-a[i]),v=c.map((x,i)=>x-a[i]);let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n)||1;n=n.map(x=>x/len);for(let p of [a,b,c])verts.push(...p,...n,...col)}
function quad(a,b,c,d,col){tri(a,b,c,col);tri(a,c,d,col)}
function box(x,y,z,w,h,d,col){let X=x-w/2,Z=z-d/2,A=[X,y,Z],B=[X+w,y,Z],C=[X+w,y,Z+d],D=[X,y,Z+d],E=[X,y+h,Z],F=[X+w,y+h,Z],G=[X+w,y+h,Z+d],H=[X,y+h,Z+d];quad(A,D,C,B,col);quad(E,F,G,H,col);quad(A,B,F,E,col);quad(B,C,G,F,col);quad(C,D,H,G,col);quad(D,A,E,H,col)}
function cyl(x,y,z,ra,rb,h,col,n=12){for(let i=0;i<n;i++){let a=i*TAU/n,b=(i+1)*TAU/n,ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b),A=[x+ra*ca,y,z+ra*sa],B=[x+ra*cb,y,z+ra*sb],C=[x+rb*cb,y+h,z+rb*sb],D=[x+rb*ca,y+h,z+rb*sa];quad(A,B,C,D,col);tri([x,y,z],B,A,col);tri([x,y+h,z],D,C,col)}}
function sphere(x,y,z,r,col){const n=10,m=7;for(let j=0;j<m;j++){let a=-Math.PI/2+j*Math.PI/m,b=-Math.PI/2+(j+1)*Math.PI/m;for(let i=0;i<n;i++){let u=i*TAU/n,v=(i+1)*TAU/n,P=(t,s)=>[x+r*Math.cos(t)*Math.cos(s),y+r*Math.sin(t),z+r*Math.cos(t)*Math.sin(s)];quad(P(a,u),P(a,v),P(b,v),P(b,u),col)}}}
function rod(x,y,z,X,Y,Z,r,col){let d=[X-x,Y-y,Z-z],l=Math.hypot(...d)||1;d=d.map(v=>v/l);let v=[d[2],0,-d[0]],vl=Math.hypot(...v);if(vl<.001)v=[1,0,0];else v=v.map(t=>t/vl);let w=[d[1]*v[2]-d[2]*v[1],d[2]*v[0]-d[0]*v[2],d[0]*v[1]-d[1]*v[0]];for(let i=0;i<8;i++){let a=i*TAU/8,b=(i+1)*TAU/8,P=(t,xx,yy,zz)=>[xx+r*(v[0]*Math.cos(t)+w[0]*Math.sin(t)),yy+r*(v[1]*Math.cos(t)+w[1]*Math.sin(t)),zz+r*(v[2]*Math.cos(t)+w[2]*Math.sin(t))];quad(P(a,x,y,z),P(b,x,y,z),P(b,X,Y,Z),P(a,X,Y,Z),col)}}
function hero(side,type,c,r){
 const alliance=side==='w';
 const armor=alliance?[.10,.31,.75]:[.57,.12,.10],metal=alliance?[.72,.86,1]:[.35,.39,.43],gold=alliance?[.98,.76,.28]:[.86,.39,.13],skin=alliance?[.89,.65,.46]:[.36,.62,.22],dark=alliance?[.07,.12,.29]:[.16,.07,.08],magic=alliance?[.23,.83,1]:[.92,.19,.57],cloth=alliance?[.17,.28,.63]:[.40,.08,.14];
 let old=verts;verts=[];
 const B=(x,y,z,w,h,d,color)=>box(x,y,z,w,h,d,color);
 const C=(x,y,z,a,b,h,color,n)=>cyl(x,y,z,a,b,h,color,n);
 const S=(x,y,z,rad,color)=>sphere(x,y,z,rad,color);
 const R=(x,y,z,X,Y,Z,rad,color)=>rod(x,y,z,X,Y,Z,rad,color);
 // Every silhouette has a different height, headgear and equipment.
 C(0,0,0,.43,.43,.10,dark,16);C(0,.10,0,.41,.37,.10,gold,16);
 if(type==='p'){
   // Infantry: short helmet, oversized shield and a long upright spear.
   B(0,.22,0,.35,.29,.27,armor);C(0,.51,0,.24,.20,.40,armor);S(0,1.00,0,.18,skin);
   C(0,1.13,0,.22,.18,.15,metal);B(0,1.25,0,.28,.09,.24,gold);
   R(-.21,.76,0,-.33,.38,0,.075,armor);R(.22,.77,0,.34,.40,0,.07,armor);
   B(-.39,.36,-.22,.35,.63,.10,metal);B(-.39,.58,-.29,.25,.12,.025,gold);
   R(.40,.30,.03,.40,1.60,.03,.035,gold);C(.40,1.54,.03,.08,0,.23,metal,6);
 }else if(type==='r'){
   // Rook: broad masonry fortress with a crenellated battlement and gate.
   C(0,.20,0,.34,.39,.18,metal,8);C(0,.38,0,.34,.32,.79,armor,8);
   C(0,1.17,0,.48,.48,.15,gold,8);
   for(let i=0;i<8;i++){let a=i*TAU/8;B(.38*Math.cos(a),1.32,.38*Math.sin(a),.19,.31,.19,metal)}
   B(0,.44,-.36,.24,.46,.035,dark);B(0,.83,-.365,.30,.055,.035,gold);
   for(let i of [-1,1])B(i*.24,.67,-.36,.055,.40,.045,metal);
 }else if(type==='n'){
   // Knight: a recognizable horse with four legs, muzzle, ears, mane and rider.
   B(0,.40,0,.45,.35,.70,armor);
   for(let x of [-.17,.17])for(let z of [-.25,.25])B(x,.13,z,.12,.35,.12,metal);
   R(0,.58,-.23,0,1.12,-.40,.20,armor);S(0,1.12,-.40,.22,skin);
   B(0,1.04,-.66,.27,.18,.42,skin);
   for(let x of [-.14,.14])B(x,1.27,-.37,.10,.25,.10,armor);
   for(let i=0;i<5;i++)B(0,.93+i*.09,-.16+i*.065,.10,.13,.11,dark);
   R(0,.53,.31,0,.25,.58,.10,dark);
   B(0,.77,.10,.28,.32,.25,metal);S(0,1.16,.11,.15,skin);C(0,1.29,.11,.18,.13,.14,gold);
   R(.20,.83,.12,.43,.40,-.20,.06,gold);
 }else if(type==='b'){
   // Bishop: tall hooded spellcaster with a pointed hat and luminous staff.
   C(0,.20,0,.29,.36,.16,cloth);C(0,.36,0,.37,.16,.87,cloth,12);
   S(0,1.27,0,.17,skin);C(0,1.37,0,.28,.22,.14,dark);
   C(0,1.50,0,.23,0,.52,armor,12);S(0,2.02,0,.08,gold);
   R(-.25,.91,0,-.43,.48,0,.085,cloth);R(.25,.91,0,.44,.58,0,.08,cloth);
   R(.46,.35,.03,.46,1.95,.03,.045,gold);S(.46,2.03,.03,.18,magic);
   S(.46,2.03,.03,.08,metal);B(0,.66,-.33,.19,.40,.045,gold);
 }else if(type==='q'){
   // Queen: long royal gown, wide spiked tiara and a jewel-tipped sceptre.
   C(0,.20,0,.39,.27,.17,cloth,16);C(0,.37,0,.38,.20,.75,armor,16);
   C(0,1.10,0,.21,.20,.20,gold,12);S(0,1.32,0,.18,skin);
   C(0,1.45,0,.27,.28,.12,gold,12);
   for(let i=0;i<7;i++){let a=i*TAU/7;R(.23*Math.cos(a),1.52,.23*Math.sin(a),.31*Math.cos(a),1.87,.31*Math.sin(a),.055,gold);S(.31*Math.cos(a),1.88,.31*Math.sin(a),.065,magic)}
   R(-.23,1.03,0,-.44,.67,0,.09,armor);R(.23,1.03,0,.44,.67,0,.09,armor);
   R(.47,.42,.02,.47,1.88,.02,.055,gold);S(.47,1.96,.02,.17,magic);
   B(0,.70,-.31,.22,.35,.045,metal);
 }else if(type==='k'){
   // King: towering shoulder armour, tall crown and a distinctive greatsword.
   C(0,.20,0,.37,.32,.18,dark,12);C(0,.38,0,.34,.27,.88,armor,12);
   B(-.36,.99,0,.32,.25,.43,metal);B(.36,.99,0,.32,.25,.43,metal);
   S(0,1.48,0,.20,skin);C(0,1.58,0,.29,.29,.13,gold,12);
   for(let i=0;i<6;i++){let a=i*TAU/6;R(.25*Math.cos(a),1.68,.25*Math.sin(a),.31*Math.cos(a),2.02,.31*Math.sin(a),.065,gold)}
   S(0,2.10,0,.12,magic);B(0,1.04,-.31,.31,.40,.06,gold);
   R(.50,.48,-.06,.50,2.13,-.06,.085,metal);B(.50,2.11,-.06,.19,.31,.08,metal);
   B(.50,1.40,-.06,.45,.075,.14,gold);R(-.27,.96,0,-.43,.49,0,.10,armor);
 }
 // Faction-specific unmistakable crests: Alliance wings, Horde forward horns.
 if(alliance){
   B(-.22,.31,.20,.16,.35,.12,gold);B(.22,.31,.20,.16,.35,.12,gold);
 }else{
   R(-.23,.31,.20,-.39,.63,.26,.065,metal);R(.23,.31,.20,.39,.63,.26,.065,metal);
 }
 let out=verts;verts=old;let co=Math.cos(yaw),si=Math.sin(yaw);
 for(let i=0;i<out.length;i+=9){let x=out[i],z=out[i+2],nx=out[i+3],nz=out[i+5];verts.push((x*co-z*si)*0.68+c-3.5,out[i+1],(x*si+z*co)*0.49+r-3.5,nx*co-nz*si,out[i+4],nx*si+nz*co,...out.slice(i+6,i+9))}
}

function shader(type,src){let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
function init(board){if(gl||failed)return;try{canvas=document.createElement('canvas');canvas.id='webgl-figures';canvas.setAttribute('aria-hidden','true');canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3';board.style.position='relative';board.append(canvas);gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});if(!gl)throw Error('WebGL non disponible');let vs=shader(gl.VERTEX_SHADER,'attribute vec3 aPos;attribute vec3 aNormal;attribute vec3 aColor;varying vec3 vColor;varying vec3 vNormal;void main(){gl_Position=vec4(aPos.x/4.0,(-aPos.z+(aPos.y-1.10)*0.25)/4.0,(-aPos.z*0.06-aPos.y*0.10),1.0);vColor=aColor;vNormal=aNormal;}'),fs=shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec3 vColor;varying vec3 vNormal;void main(){vec3 n=normalize(vNormal);float light=0.48+0.52*abs(dot(n,normalize(vec3(-0.5,0.9,0.7))));gl_FragColor=vec4(vColor*light,1.0);}');program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));buffer=gl.createBuffer();gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL)}catch(e){failed=true;console.error('Azeroth WebGL:',e);if(canvas)canvas.remove();gl=null}}
function draw(board,pieces){init(board);if(!gl)return false;if(canvas.parentElement!==board)board.append(canvas);let dpr=Math.min(devicePixelRatio||1,2),size=Math.round(board.clientWidth*dpr);if(!size)return false;if(canvas.width!==size||canvas.height!==size){canvas.width=canvas.height=size;gl.viewport(0,0,size,size)}verts=[];for(let p of pieces)hero(p.side,p.type,p.c,p.r);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.DYNAMIC_DRAW);for(let [name,offset] of [['aPos',0],['aNormal',3],['aColor',6]]){let loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,36,offset*4)}gl.drawArrays(gl.TRIANGLES,0,verts.length/9);return true}
window.Azeroth3D={draw,rotate(){yaw+=Math.PI/4},available:true};})();
