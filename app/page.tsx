"use client";

import { useState } from "react";

const photos = [
  { src: "/sports.jpg", title: "Sports & Teamwork", desc: "Football team building discipline and camaraderie." },
  { src: "/scouts.jpg", title: "Scout Troop", desc: "Scouts cultivating leadership and character." },
  { src: "/jamboree.jpg", title: "Scouting Jamboree", desc: "Students showcasing practical skills at camp." },
  { src: "/certificates.jpg", title: "Certificates of Participation", desc: "Students proudly holding their certificates." },
];

type Page = "home" | "about" | "academics" | "downloads" | "student" | "staff";

export default function SchoolPortal() {
  const [page, setPage] = useState<Page>("home");
  const [studentAdm, setStudentAdm] = useState("");
  const [studentPin, setStudentPin] = useState("");
  const [studentMsg, setStudentMsg] = useState<{type:"ok"|"err", text:string}|null>(null);
  const [staffId, setStaffId] = useState("");
  const [staffPw, setStaffPw] = useState("");
  const [staffMsg, setStaffMsg] = useState<{type:"ok"|"err", text:string}|null>(null);

  const nav = (p: Page) => { setPage(p); window.scrollTo(0,0); };

  const navItems: {label:string; page:Page}[] = [
    {label:"Home", page:"home"},
    {label:"About Us", page:"about"},
    {label:"Academics", page:"academics"},
    {label:"Downloads", page:"downloads"},
    {label:"Student Portal", page:"student"},
    {label:"Staff Portal", page:"staff"},
  ];

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif", minHeight:"100vh", background:"#fdf8f0"}}>
      {/* NAV */}
      <nav style={{background:"#0d1f12", position:"sticky", top:0, zIndex:100, display:"flex", alignItems:"center", padding:"0 1.5rem", height:64, boxShadow:"0 2px 16px rgba(0,0,0,.4)", flexWrap:"wrap"}}>
        <span style={{color:"#f0c060", fontWeight:900, fontSize:"1.05rem", flex:1}}>🏫 WAMY Isiolo</span>
        <div style={{display:"flex", gap:4, flexWrap:"wrap"}}>
          {navItems.map(item => (
            <button key={item.page} onClick={()=>nav(item.page)} style={{
              background: page===item.page ? "rgba(255,255,255,.12)" : "none",
              border:"none", color: page===item.page ? "#f0c060" : "#b8d4c0",
              padding:"6px 12px", borderRadius:6, cursor:"pointer", fontSize:"0.83rem", fontWeight:500
            }}>{item.label}</button>
          ))}
        </div>
      </nav>

      {/* HOME */}
      {page==="home" && (
        <div>
          <div style={{background:"linear-gradient(135deg,#0d1f12 0%,#1a3d22 55%,#2a6b40 100%)", color:"#fff", textAlign:"center", padding:"5rem 2rem 4rem"}}>
            <p style={{fontSize:".72rem", letterSpacing:".25em", textTransform:"uppercase", color:"#f0c060", marginBottom:"0.8rem"}}>Official School Portal</p>
            <h1 style={{fontFamily:"Georgia,serif", fontSize:"clamp(2rem,5vw,3.6rem)", fontWeight:900, lineHeight:1.1, marginBottom:"0.8rem"}}>WAMY Isiolo<br/>High School</h1>
            <p style={{color:"#a8d4b8", maxWidth:520, margin:"0 auto 2.4rem"}}>Excellence In Education — nurturing future leaders through quality education and holistic character development.</p>
            <div style={{display:"flex", justifyContent:"center", gap:"3rem", flexWrap:"wrap"}}>
              {[["69+","Students"],["8","Staff Members"],["3","Classes"]].map(([n,l])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"Georgia,serif", fontSize:"2.4rem", color:"#f0c060", fontWeight:900}}>{n}</div>
                  <div style={{fontSize:".72rem", letterSpacing:".12em", textTransform:"uppercase", color:"#a8d4b8"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{maxWidth:900, margin:"3rem auto", padding:"0 1.5rem", textAlign:"center"}}>
            <h2 style={{fontFamily:"Georgia,serif", fontSize:"1.9rem", marginBottom:"1rem", color:"#0d1f12"}}>Welcome to WAMY Isiolo High School</h2>
            <p style={{color:"#4a6650", lineHeight:1.8}}>Dedicated to academic excellence and holistic development. Our institution strives to nurture future leaders through quality education and character building. We offer STEM, Social Sciences, and Islamic classes in a Day & Boarding setting.</p>
          </div>

          <div style={{maxWidth:1100, margin:"0 auto", padding:"1rem 1.5rem 4rem"}}>
            <p style={{fontSize:".7rem", letterSpacing:".2em", textTransform:"uppercase", color:"#28a459", fontWeight:600, marginBottom:".4rem"}}>School Life</p>
            <h2 style={{fontFamily:"Georgia,serif", fontSize:"clamp(1.6rem,3vw,2.2rem)", fontWeight:900, color:"#0d1f12", marginBottom:"1.5rem"}}>Moments from Our Community</h2>
            <div style={{display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"1.4rem"}}>
              {photos.map((p,i)=>(
                <div key={i} style={{background:"#fff", borderRadius:14, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.07)"}}>
                  <img src={p.src} alt={p.title} style={{width:"100%", height:230, objectFit:"cover", display:"block"}}/>
                  <div style={{padding:".9rem 1.1rem"}}>
                    <strong style={{fontFamily:"Georgia,serif", fontSize:".98rem", color:"#0d1f12"}}>📸 {p.title}</strong>
                    <p style={{fontSize:".83rem", color:"#5a7060", marginTop:".3rem"}}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABOUT */}
      {page==="about" && (
        <div>
          <div style={{background:"linear-gradient(135deg,#0d1f12,#1e4728)", color:"#fff", padding:"4rem 2rem 3rem", textAlign:"center"}}>
            <p style={{fontSize:".7rem", letterSpacing:".22em", textTransform:"uppercase", color:"#f0c060", marginBottom:".6rem"}}>Who We Are</p>
            <h1 style={{fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:900}}>About Us</h1>
            <p style={{color:"#a8d4b8", marginTop:".8rem", maxWidth:560, margin:".8rem auto 0"}}>Learn about our mission, values, and the community that makes WAMY Isiolo special.</p>
          </div>
          <div style={{maxWidth:900, margin:"3rem auto", padding:"0 1.5rem 4rem"}}>
            {[
              {title:"🌿 Our Mission", text:"To provide quality, inclusive, and values-based education that equips students with academic excellence, strong character, and life skills necessary to thrive in a dynamic world."},
              {title:"🎯 Our Vision", text:"To be a leading institution in Isiolo County that produces responsible, knowledgeable, and faith-grounded graduates who contribute positively to society."},
              {title:"🏫 About the School", text:"WAMY Isiolo High School is a Day and Boarding senior school in Isiolo County, Kenya. We offer STEM, Social Sciences, and Islamic classes with over 69 students, 8 staff members, and 3 classes."},
              {title:"⭐ Core Values", text:"Academic Excellence • Integrity & Discipline • Inclusivity & Respect • Community Service • Faith & Character"},
              {title:"🤝 Extra-Curricular", text:"Football & Sports • Scout Troop • First Aid Training • Inter-school competitions and jamborees"},
            ].map(b=>(
              <div key={b.title} style={{background:"#fff", borderRadius:14, padding:"2rem", marginBottom:"1.2rem", boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
                <h3 style={{fontFamily:"Georgia,serif", fontSize:"1.2rem", color:"#1a6b3a", marginBottom:".7rem"}}>{b.title}</h3>
                <p style={{color:"#4a6650", lineHeight:1.8}}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACADEMICS */}
      {page==="academics" && (
        <div>
          <div style={{background:"linear-gradient(135deg,#0d1f12,#1e4728)", color:"#fff", padding:"4rem 2rem 3rem", textAlign:"center"}}>
            <p style={{fontSize:".7rem", letterSpacing:".22em", textTransform:"uppercase", color:"#f0c060", marginBottom:".6rem"}}>Learning & Growth</p>
            <h1 style={{fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:900}}>Academics</h1>
            <p style={{color:"#a8d4b8", marginTop:".8rem", maxWidth:560, margin:".8rem auto 0"}}>A balanced curriculum developing the whole student — mind, character, and faith.</p>
          </div>
          <div style={{maxWidth:900, margin:"3rem auto", padding:"0 1.5rem 4rem"}}>
            <div style={{background:"#fff", borderRadius:14, padding:"2rem", marginBottom:"1.4rem", boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
              <h3 style={{fontFamily:"Georgia,serif", fontSize:"1.2rem", color:"#1a6b3a", marginBottom:".7rem"}}>📚 Curriculum Overview</h3>
              <p style={{color:"#4a6650", lineHeight:1.8}}>We follow the Kenya National Curriculum enriched with Islamic studies and values education, combining rigorous academic standards with practical skills and character formation.</p>
            </div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"1.2rem"}}>
              {[
                {icon:"🔬", title:"STEM", desc:"Mathematics, Physics, Chemistry, Biology and Computer Science with hands-on approaches."},
                {icon:"🌍", title:"Social Sciences", desc:"History, Geography, CRE/IRE, and Life Skills for well-rounded social understanding."},
                {icon:"📖", title:"Languages", desc:"English, Kiswahili, and Arabic programmes to build communication excellence."},
                {icon:"🕌", title:"Islamic Classes", desc:"Quran, Fiqh, and Islamic studies integrated into daily school life."},
                {icon:"🏕️", title:"Co-Curricular", desc:"Scouts, sports, first aid, and environmental clubs developing leadership."},
                {icon:"🎓", title:"Boarding", desc:"Structured boarding with supervised study, meals, and pastoral care."},
              ].map(s=>(
                <div key={s.title} style={{background:"#fff", borderRadius:12, padding:"1.5rem", boxShadow:"0 2px 10px rgba(0,0,0,.06)", borderTop:"4px solid #28a459"}}>
                  <div style={{fontSize:"1.8rem", marginBottom:".6rem"}}>{s.icon}</div>
                  <h4 style={{fontFamily:"Georgia,serif", fontSize:"1.05rem", color:"#0d1f12", marginBottom:".4rem"}}>{s.title}</h4>
                  <p style={{fontSize:".85rem", color:"#5a7060", lineHeight:1.6}}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DOWNLOADS */}
      {page==="downloads" && (
        <div>
          <div style={{background:"linear-gradient(135deg,#0d1f12,#1e4728)", color:"#fff", padding:"4rem 2rem 3rem", textAlign:"center"}}>
            <p style={{fontSize:".7rem", letterSpacing:".22em", textTransform:"uppercase", color:"#f0c060", marginBottom:".6rem"}}>Resources</p>
            <h1 style={{fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:900}}>Downloads</h1>
            <p style={{color:"#a8d4b8", marginTop:".8rem"}}>Access important school documents and resources.</p>
          </div>
          <div style={{maxWidth:800, margin:"3rem auto", padding:"0 1.5rem 4rem"}}>
            {[
              {icon:"📋", title:"School Fee Structure 2024/2025", sub:"PDF — Updated January 2025"},
              {icon:"📝", title:"Admission Form", sub:"PDF — New Student Registration"},
              {icon:"📅", title:"2025 School Calendar", sub:"PDF — Term dates & holidays"},
              {icon:"📜", title:"School Rules & Regulations", sub:"PDF — Student Handbook"},
              {icon:"🩺", title:"Medical / Health Form", sub:"PDF — Required for boarding students"},
            ].map(d=>(
              <div key={d.title} style={{background:"#fff", borderRadius:12, padding:"1.2rem 1.5rem", display:"flex", alignItems:"center", gap:"1rem", boxShadow:"0 2px 10px rgba(0,0,0,.06)", marginBottom:"1rem"}}>
                <span style={{fontSize:"1.8rem"}}>{d.icon}</span>
                <div style={{flex:1}}>
                  <strong style={{display:"block", color:"#0d1f12"}}>{d.title}</strong>
                  <span style={{fontSize:".8rem", color:"#7a9480"}}>{d.sub}</span>
                </div>
                <button onClick={()=>alert("Contact school administration for this document.")} style={{background:"#1a6b3a", color:"#fff", border:"none", padding:".5rem 1.1rem", borderRadius:8, fontSize:".83rem", cursor:"pointer"}}>Download</button>
              </div>
            ))}
            <p style={{textAlign:"center", fontSize:".85rem", color:"#7a9480", marginTop:"1.5rem"}}>📞 For other documents, contact the school office directly.</p>
          </div>
        </div>
      )}

      {/* STUDENT PORTAL */}
      {page==="student" && (
        <div>
          <div style={{background:"linear-gradient(135deg,#0d1f12,#1e4728)", color:"#fff", padding:"4rem 2rem 3rem", textAlign:"center"}}>
            <p style={{fontSize:".7rem", letterSpacing:".22em", textTransform:"uppercase", color:"#f0c060", marginBottom:".6rem"}}>Student Access</p>
            <h1 style={{fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:900}}>Student Portal</h1>
          </div>
          <div style={{maxWidth:440, margin:"3rem auto", padding:"0 1.5rem 4rem"}}>
            <div style={{background:"#fff", borderRadius:18, padding:"2.5rem", boxShadow:"0 4px 30px rgba(0,0,0,.1)"}}>
              <h2 style={{fontFamily:"Georgia,serif", fontSize:"1.6rem", color:"#0d1f12", marginBottom:".4rem"}}>Student Login</h2>
              <p style={{color:"#7a9480", fontSize:".88rem", marginBottom:"2rem"}}>Enter your admission number and PIN</p>
              {studentMsg && <div style={{padding:".75rem", borderRadius:8, marginBottom:"1rem", background: studentMsg.type==="ok" ? "#eafff0" : "#ffeaea", color: studentMsg.type==="ok" ? "#1a6b3a" : "#b00", border:`1px solid ${studentMsg.type==="ok"?"#b0e8c0":"#f5c0c0"}`}}>{studentMsg.text}</div>}
              <div style={{marginBottom:"1rem"}}>
                <label style={{display:"block", fontSize:".8rem", fontWeight:600, marginBottom:".35rem"}}>Admission Number</label>
                <input value={studentAdm} onChange={e=>setStudentAdm(e.target.value)} placeholder="e.g. WIS/2024/001" style={{width:"100%", padding:".7rem 1rem", border:"1.5px solid #d4e8d8", borderRadius:9, fontSize:".93rem", outline:"none"}}/>
              </div>
              <div style={{marginBottom:"1rem"}}>
                <label style={{display:"block", fontSize:".8rem", fontWeight:600, marginBottom:".35rem"}}>PIN / Password</label>
                <input type="password" value={studentPin} onChange={e=>setStudentPin(e.target.value)} placeholder="Enter your PIN" style={{width:"100%", padding:".7rem 1rem", border:"1.5px solid #d4e8d8", borderRadius:9, fontSize:".93rem", outline:"none"}}/>
              </div>
              <button onClick={()=>{ if(!studentAdm||!studentPin){setStudentMsg({type:"err",text:"Please enter your admission number and PIN."})} else {setStudentMsg({type:"ok",text:"✓ Login successful! Student dashboard coming soon."})} }} style={{width:"100%", padding:".85rem", background:"#1a6b3a", color:"#fff", border:"none", borderRadius:10, fontSize:".97rem", fontWeight:600, cursor:"pointer"}}>Sign In →</button>
              <p style={{textAlign:"center", marginTop:"1.2rem", fontSize:".8rem", color:"#7a9480"}}>Forgot your PIN? Contact your class teacher.</p>
            </div>
          </div>
        </div>
      )}

      {/* STAFF PORTAL */}
      {page==="staff" && (
        <div>
          <div style={{background:"linear-gradient(135deg,#0d1f12,#1e4728)", color:"#fff", padding:"4rem 2rem 3rem", textAlign:"center"}}>
            <p style={{fontSize:".7rem", letterSpacing:".22em", textTransform:"uppercase", color:"#f0c060", marginBottom:".6rem"}}>Staff Access</p>
            <h1 style={{fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:900}}>Staff Portal</h1>
          </div>
          <div style={{maxWidth:440, margin:"3rem auto", padding:"0 1.5rem 4rem"}}>
            <div style={{background:"#fff", borderRadius:18, padding:"2.5rem", boxShadow:"0 4px 30px rgba(0,0,0,.1)"}}>
              <h2 style={{fontFamily:"Georgia,serif", fontSize:"1.6rem", color:"#0d1f12", marginBottom:".4rem"}}>Staff Login</h2>
              <p style={{color:"#7a9480", fontSize:".88rem", marginBottom:"2rem"}}>Enter your staff ID and password</p>
              {staffMsg && <div style={{padding:".75rem", borderRadius:8, marginBottom:"1rem", background: staffMsg.type==="ok" ? "#eafff0" : "#ffeaea", color: staffMsg.type==="ok" ? "#1a6b3a" : "#b00", border:`1px solid ${staffMsg.type==="ok"?"#b0e8c0":"#f5c0c0"}`}}>{staffMsg.text}</div>}
              <div style={{marginBottom:"1rem"}}>
                <label style={{display:"block", fontSize:".8rem", fontWeight:600, marginBottom:".35rem"}}>Staff ID</label>
                <input value={staffId} onChange={e=>setStaffId(e.target.value)} placeholder="e.g. WIS/STF/001" style={{width:"100%", padding:".7rem 1rem", border:"1.5px solid #d4e8d8", borderRadius:9, fontSize:".93rem", outline:"none"}}/>
              </div>
              <div style={{marginBottom:"1rem"}}>
                <label style={{display:"block", fontSize:".8rem", fontWeight:600, marginBottom:".35rem"}}>Password</label>
                <input type="password" value={staffPw} onChange={e=>setStaffPw(e.target.value)} placeholder="Enter your password" style={{width:"100%", padding:".7rem 1rem", border:"1.5px solid #d4e8d8", borderRadius:9, fontSize:".93rem", outline:"none"}}/>
              </div>
              <button onClick={()=>{ if(!staffId||!staffPw){setStaffMsg({type:"err",text:"Please enter your Staff ID and password."})} else {setStaffMsg({type:"ok",text:"✓ Login successful! Staff dashboard coming soon."})} }} style={{width:"100%", padding:".85rem", background:"#1a6b3a", color:"#fff", border:"none", borderRadius:10, fontSize:".97rem", fontWeight:600, cursor:"pointer"}}>Sign In →</button>
              <p style={{textAlign:"center", marginTop:"1.2rem", fontSize:".8rem", color:"#7a9480"}}>For account issues, contact the school administrator.</p>
            </div>
          </div>
        </div>
      )}

      <footer style={{background:"#0d1f12", color:"#5a8065", textAlign:"center", fontSize:".8rem", padding:"1.6rem"}}>
        © 2026 <strong style={{color:"#f0c060"}}>WAMY Isiolo High School</strong> — Excellence In Education | Isiolo County, Kenya
      </footer>
    </div>
  );
}
