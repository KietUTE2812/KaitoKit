'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Portfolio() {
    const [activeTab, setActiveTab] = useState('about');
    const [openIntro, setOpenIntro] = useState(true);
    const upCoponentRef = useRef<HTMLDivElement>(null);
    const downCoponentRef = useRef<HTMLDivElement>(null);

    const [animate, setAnimate] = useState(false); // Thời gian biến mất

    useEffect(() => {
        const introTimeout = setTimeout(() => {
            setOpenIntro(false);
        }, 3000);
        return () => clearTimeout(introTimeout);
    }, []);

    useEffect(() => {
        const introTimeout = setTimeout(() => {
            setAnimate(true); // bắt đầu animation
        }, 2000); // delay 1 giây

        return () => clearTimeout(introTimeout);
    }, []);

    useEffect(() => {
        document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
        fallAnimation();
    }, []);

    // Scroll reveal animations
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);


    const fallAnimation = () => {
        const numImages = 15;
        const duration = 5; // thời gian rơi
        const delay = 5; // độ trễ
        for (let i = 0; i < numImages; i++) {
            const img = document.createElement("img");
            img.src = "/Kit.png";
            img.className = "fall";

            // Random vị trí ngang (chỉ lấy 10% vị trí ngang = 10)
            img.style.left = Math.random() * 95 + "vw";

            img.style.animationDuration = duration + "s";
            // Random độ trễ
            img.style.animationDelay = Math.random() * delay + "s";

            document.body.appendChild(img);
        }
    }

    const skillGroups = [
        {
            title: 'Frontend Development',
            icon: '🎨',
            skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Redux']
        },
        {
            title: 'Backend Development',
            icon: '⚙️',
            skills: ['Node.js', 'Next.js', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'REST API']
        },
        {
            title: 'DevOps & Tools',
            icon: '🛠️',
            skills: ['Git', 'Docker', 'AWS']
        },
        {
            title: 'Design & UI/UX',
            icon: '🎯',
            skills: ['Figma', 'Responsive Design', 'Material-UI', 'Bootstrap']
        }
    ];

    const projects = [
        {
            title: 'Interactive Coding Learning Platform',
            description: 'The platform allows users to learn coding through interactive video lessons, where they can write code, run it, and see the results in real-time.',
            image: '/logo.jpg',
            tech: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'MinIO', 'WebRTC'],
            link: 'https://github.com/KietUTE2812/server-interactive-video'
        },
        {
            title: 'Portfolio Website',
            description: 'Modern portfolio website and blog website, built with Next.js, Tailwind CSS, TypeScript, and Node.js',
            image: '/Kit2.png',
            tech: ['Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'MongoDB'],
            link: '#'
        }
    ];

    const experiences = [
        {
            company: 'Ho Chi Minh City University of Technology and Education (HCMUTE)',
            role: 'Student',
            period: '2021 - 2025',
            details: [
                'Studying at the University of Technology and Education of Ho Chi Minh City',
                'Studying Computer Science and Technology',
            ],
        },
        {
            company: 'Tech 247 Company',
            role: 'Intern',
            period: '2024',
            details: [
                'Learning about web development: HTML, CSS, JavaScript',
                'Learning and developing web applications with WordPress',
            ],
        }
    ];

    return (
        <div className="min-h-screen relative bg-[#0b0616] overflow-hidden">
            <img className="absolute inset-0 h-full w-full scale-[1.02] object-cover blur-2xl opacity-25" alt="" aria-hidden="true" sizes="100vw" loading="eager" srcSet="https://persistent.oaistatic.com/burrito-nux/640.webp 640w, https://persistent.oaistatic.com/burrito-nux/1280.webp 1280w, https://persistent.oaistatic.com/burrito-nux/1920.webp 1920w" src="https://persistent.oaistatic.com/burrito-nux/1280.webp"></img>
            {/* <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-[#1a0b3a] via-[#0b0616] to-black animate-gradient opacity-80"></div> */}
            {/* <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6))]"></div> */}
            {/* Intro Animation */}
            {openIntro && (
                // Lớp phủ
                <div className='fixed inset-0 z-20 w-full h-full flex flex-col'>
                    <div ref={upCoponentRef} className=' bg-gradient-to-b from-[#c39eff] to-[#ffb28c] z-20 w-full h-1/2 transition-all duration-1000 ease-in-out' style={{ transform: !animate ? 'translateY(0)' : 'translateY(-100%)' }}></div>
                    <div ref={downCoponentRef} className='bg-gradient-to-t from-[#c39eff] to-[#ffb28c] z-20 w-full h-1/2 transition-all duration-1000 ease-in-out' style={{ transform: !animate ? 'translateY(0)' : 'translateY(100%)' }}></div>
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 object-cover rounded-full z-30'
                        style={{
                            transformStyle: 'preserve-3d',
                            perspective: '1000px',
                        }}>
                        <img src="/Kit.png" alt="Profile" className="w-full h-full object-cover"
                            style={{
                                animation: !animate ? 'flip-around 1.5s linear infinite' : 'fade-out 0.5s ease forwards',
                            }} />
                    </div>
                </div>
            )}
            {/* Hero Section */}
            <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-white" >

                <div className="relative z-10 text-center max-w-6xl mx-auto px-4 flex flex-row items-center justify-center gap-10">
                    <div className="relative">
                        <div className="absolute z-10 top-[-15%] right-[-30%]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 79 48" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M0.409811 47.3962C0.409811 47.3962 0.409727 47.3963 0.540564 47.4697C0.611952 47.6016 0.612045 47.6016 0.612045 47.6016L0.61939 47.5976L0.641876 47.5855L0.730429 47.5382C0.808316 47.4967 0.923207 47.436 1.07095 47.3588C1.36645 47.2044 1.79333 46.9845 2.31837 46.7225C3.36861 46.1985 4.8109 45.5067 6.37975 44.8349C7.94916 44.1628 9.64228 43.5121 11.1948 43.0693C12.753 42.6248 14.1485 42.3961 15.1322 42.5499L15.1785 42.2535C14.1259 42.089 12.6764 42.3347 11.1125 42.7808C9.54291 43.2285 7.83687 43.8846 6.26166 44.5591C4.6859 45.2339 3.23811 45.9284 2.18444 46.4541C1.65752 46.717 1.22898 46.9378 0.932048 47.0929C0.925245 47.0964 0.918512 47.0999 0.911849 47.1034C0.956917 47.0199 1.00764 46.9253 1.06341 46.8204C1.30766 46.3614 1.64894 45.7059 2.03734 44.9196C2.81384 43.3475 3.78001 41.2499 4.53554 39.1525C5.28922 37.0603 5.84074 34.9487 5.77222 33.356C5.73791 32.5586 5.54747 31.871 5.12845 31.3832C4.70476 30.8901 4.06748 30.6243 3.19228 30.6328L3.19519 30.9328C4.00484 30.9249 4.54829 31.1683 4.9009 31.5787C5.25818 31.9946 5.43963 32.6049 5.4725 33.3689C5.53832 34.8989 5.00534 36.9631 4.2533 39.0508C3.50312 41.1333 2.54236 43.2197 1.76836 44.7867C1.38151 45.5699 1.04165 46.2227 0.798567 46.6795C0.677032 46.9079 0.579708 47.0873 0.512822 47.2096C0.479379 47.2707 0.453548 47.3175 0.436106 47.3489L0.416331 47.3845L0.409811 47.3962ZM0.540564 47.4697L0.612045 47.6016L0.156433 47.8481L0.409811 47.3962L0.540564 47.4697Z" fill="white" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M38.8032 11.1122C25.9197 18.0561 14.4217 27.8131 7.47084 39.0643L7.72607 39.2219C14.6424 28.0267 26.0951 18.3023 38.9455 11.3763C51.7959 4.45035 66.03 0.330274 78.4998 0.330273V0.0302734C65.9696 0.0302729 51.6867 4.16841 38.8032 11.1122Z" fill="white" />
                            </svg>
                            <div className="absolute z-10 top-[0] left-[calc(100%+10px)] flex flex-row items-center justify-center w-fit">
                                <p className="text-white text-xl font-bold mr-6 whitespace-nowrap">
                                    Hello! I'm
                                </p>
                                <p className="text-blue-500 whitespace-nowrap"
                                    style={{
                                        fontFamily: 'Playwrite AU QLD, cursive',
                                        fontWeight: 'bold',
                                        fontSize: '2rem',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                    }}>
                                    Đào Tấn Kiệt
                                </p>
                            </div>
                        </div>
                        <div className="w-80 h-80 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white/70 shadow-[0_0_80px_rgba(99,102,241,0.25)] relative animate-glow">
                            <img src="/logo.jpg" alt="Profile" className="w-full h-full object-cover rounded-full" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-5xl font-extrabold mb-4 gradient-text drop-shadow-sm">I'm a Software Engineer</h1>
                        <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
                            I'm a developer passionate about technology and web application development.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <a href="/DAOTANKIET_SOFTWARE_ENGINEER.pdf" download="DAOTANKIET_SOFTWARE_ENGINEER.pdf" target="_blank" rel="noreferrer" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                                Download CV
                            </a>
                            <a href="#contact" className="border-2 border-white/80 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors shadow-lg">
                                Contact me
                            </a>
                        </div>
                    </div>

                </div>
                {/* Social Media */}
                <div className="flex flex-row items-center justify-center gap-4">
                    <div className="flex flex-row items-center justify-center">
                        <p className="text-white text-sm">More about me</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-4">
                        <a href="https://www.facebook.com/tankiet2812" target="_blank" rel="noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                        </a>
                        <a href="https://www.linkedin.com/in/dao-tan-kiet-079424312/" target="_blank" rel="noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect width="4" height="12" x="2" y="9" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                        </a>
                        <a href="https://github.com/KietUTE2812" target="_blank" rel="noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                            </svg>
                        </a>
                    </div>

                </div>
                <a href="#skills" className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </a>
            </section >

            {/* Skill Section */}
            < section id="skills" className="relative h-fit py-24 text-white" >
                <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-float-slow" aria-hidden />
                <div className="pointer-events-none absolute top-1/3 -right-24 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-float-slow" aria-hidden />
                <div className="relative z-10 max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-text">Skills</h2>
                    <p className="text-white/70 mb-10">Technologies and tools I use frequently</p>
                    <div className="flex flex-row items-center justify-center gap-10">
                        <div className="w-1/3 reveal" style={{
                            animation: 'flip-around 2s linear infinite',
                        }}>
                            <img src="/Kit.png" alt="Skill" className="w-full h-full object-cover" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-2/3">
                            {skillGroups.map((group) => (
                                <div key={group.title} className="reveal bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 hover:bg-white/15 transition transform hover:-translate-y-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-2xl" aria-hidden>{group.icon}</span>
                                        <h3 className="text-xl font-semibold">{group.title}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {group.skills.map((skill) => (
                                            <span key={skill} className="px-3 py-1 rounded-full text-sm bg-blue-500/20 border border-blue-400/30">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section >

            {/* Project Section */}
            < section id="projects" className="relative h-fit py-24 text-white" >
                <div className="pointer-events-none absolute -bottom-24 left-1/3 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-float-slow" aria-hidden />
                <div className="relative z-10 max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-text">Projects</h2>
                    <p className="text-white/70 mb-10">A selection of things I’ve built</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
                        {projects.map((project) => (
                            // Flip card
                            <div key={project.title} className="flip-card">
                                <div className="flip">
                                    <div className="front-card bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                                        <img src={project.image} alt={project.title} className="w-[90%] h-[80%] object-cover rounded-xl border-2 border-white/50" />
                                        <div className="text-center mt-4">
                                            <h3 className="text-2xl font-semibold text-[#c39eff]">
                                                {project.title}

                                            </h3>

                                        </div>
                                    </div>
                                    <div className="back-card bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                                        <img src={project.image} alt={project.title} className="absolute top-0 left-0 w-full h-full blur-sm opacity-30 object-cover rounded-xl z-10" />
                                        <h3 className="text-2xl text-center font-semibold text-[#c39eff] z-20">
                                            {project.title}

                                        </h3>
                                        <a href={project.link} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-full text-sm bg-blue-500 border border-blue-400/30 animate-bounce z-20">
                                            View Project
                                        </a>

                                        <p className="text-white/80 z-20">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-4 z-20">
                                            {project.tech.map((t) => (
                                                <span key={t} className="px-3 py-1 rounded-full text-sm bg-blue-500/40 border border-blue-400/30">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Experience Section */}
            < section id="experience" className="relative h-fit py-24 text-white" >
                <div className="relative z-10 max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-text">Experience</h2>
                    <p className="text-white/70 mb-10">What I’ve done so far</p>
                    <div className="relative pl-6">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/20" aria-hidden />
                        <div className="space-y-8">
                            {experiences.map((exp) => (
                                <div key={`${exp.company}-${exp.period}`} className="relative reveal">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white/60" aria-hidden />
                                    <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <h3 className="text-xl font-semibold">{exp.role} — {exp.company}</h3>
                                            <span className="text-sm text-white/70">{exp.period}</span>
                                        </div>
                                        <ul className="list-disc pl-5 space-y-1 text-white/85">
                                            {exp.details.map((d, idx) => (
                                                <li key={idx}>{d}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section >

            {/* Contact Section */}
            < section id="contact" className="relative h-fit py-24 text-white" >
                <div className="relative z-10 max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-text">Contact</h2>
                    <p className="text-white/70 mb-10">I’m open to freelance, collaboration, and full-time opportunities</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="reveal bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                            <h3 className="text-lg font-semibold mb-4">Get in touch</h3>
                            <p className="text-white/80 mb-4">Have a question or want to work together? Send me a message.</p>
                            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                                <div>
                                    <label className="block text-sm mb-1" htmlFor="name">Name</label>
                                    <input id="name" className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1" htmlFor="email">Email</label>
                                    <input id="email" type="email" className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1" htmlFor="message">Message</label>
                                    <textarea id="message" rows={4} className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500" placeholder="How can I help?" />
                                </div>
                                <button className="w-full bg-white text-blue-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition" type="submit">Send</button>
                            </form>
                        </div>
                        <div className="reveal bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                            <h3 className="text-lg font-semibold mb-4">Contact info</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="mailto:kiet.ute2812@gmail.com" className="hover:underline">tankiet281203@gmail.com</a>
                                </li>
                                <li>
                                    <a href="https://github.com/KietUTE2812" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
                                </li>
                                <li>
                                    <a href="https://www.linkedin.com/in/dao-tan-kiet-079424312/" target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
}