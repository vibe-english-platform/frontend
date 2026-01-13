import { BookOpen, Brain, Trophy, Sparkles, Star, TrendingUp, Zap, Rocket } from "lucide-react";
import { Button } from "./ui/button";

interface HeroSectionProps {
    onGetStarted?: () => void;
    onSignIn?: () => void;
    isAuthenticated?: boolean;
}

function HeroSection({ onGetStarted, onSignIn, isAuthenticated }: HeroSectionProps) {
    return (
        <div className="relative overflow-hidden">
            {/* Hero Section */}
            <section className="text-center py-20 px-4 relative">
                {/* Floating Cartoon Elements */}
                <div className="absolute top-20 left-10 text-6xl animate-bounce-slow">🎨</div>
                <div className="absolute top-40 right-20 text-5xl animate-float" style={{ animationDelay: "0.5s" }}>
                    📚
                </div>
                <div className="absolute bottom-40 left-20 text-4xl animate-spin-slow">⭐</div>
                <div className="absolute top-60 right-10 text-5xl animate-wiggle">🚀</div>
                <div
                    className="absolute bottom-20 right-40 text-4xl animate-bounce-slow"
                    style={{ animationDelay: "1s" }}>
                    💡
                </div>

                {/* Colorful blobs */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-40 animate-pulse-slow"></div>
                <div
                    className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-2xl opacity-40 animate-pulse-slow"
                    style={{ animationDelay: "1s" }}></div>
                <div
                    className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-30 animate-pulse-slow"
                    style={{ animationDelay: "0.5s" }}></div>

                <div className="relative z-10">
                    {/* Cartoon badge */}
                    <div className="inline-block mb-6">
                        <span className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-full text-white font-black text-sm shadow-[0_8px_0_rgba(0,0,0,0.2)] border-4 border-white hover:shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all">
                            ✨ AI-POWERED SUPER LEARNING! ✨
                        </span>
                    </div>

                    <h1
                        className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight"
                        style={{
                            textShadow: "4px 4px 0 rgba(0,0,0,0.2), 8px 8px 0 rgba(0,0,0,0.1)",
                            transform: "rotate(-2deg)",
                        }}>
                        Master English
                        <span
                            className="block bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent mt-2"
                            style={{ transform: "rotate(2deg)" }}>
                            The Fun Way! 🎉
                        </span>
                    </h1>

                    <p
                        className="text-2xl text-white font-bold max-w-2xl mx-auto mb-10 leading-relaxed"
                        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                        🎮 Learn vocabulary through <span className="text-yellow-300">AI-powered</span> visual cards,
                        <span className="text-pink-300"> interactive games</span>, and
                        <span className="text-cyan-300"> spaced repetition!</span>
                    </p>

                    <div className="flex gap-4 justify-center flex-wrap mb-6">
                        <Button
                            onClick={onGetStarted}
                            size="lg"
                            className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white hover:from-yellow-500 hover:via-orange-500 hover:to-pink-600 font-black text-xl px-10 py-7 rounded-full shadow-[0_8px_0_rgba(0,0,0,0.3)] border-4 border-white hover:shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:translate-y-1 transition-all">
                            <Rocket className="mr-2" />
                            START FREE NOW! 🎊
                        </Button>
                        {!isAuthenticated && (
                            <Button
                                onClick={onSignIn}
                                size="lg"
                                className="bg-white text-purple-600 hover:bg-gray-100 font-black text-xl px-10 py-7 rounded-full shadow-[0_8px_0_rgba(0,0,0,0.2)] border-4 border-purple-400 hover:shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all">
                                Sign In ✌️
                            </Button>
                        )}
                    </div>

                    {/* Stats with cartoon style */}
                    <div className="mt-16 flex gap-6 justify-center flex-wrap">
                        {[
                            {
                                emoji: "👥",
                                value: "10K+",
                                label: "Happy Learners",
                                color: "from-purple-400 to-pink-400",
                            },
                            {
                                emoji: "📖",
                                value: "50K+",
                                label: "Words Mastered",
                                color: "from-yellow-400 to-orange-400",
                            },
                            {
                                emoji: "🏆",
                                value: "95%",
                                label: "Success Rate",
                                color: "from-green-400 to-emerald-400",
                            },
                        ].map((stat, i) => (
                            <div key={i} className="relative group">
                                <div
                                    className={`bg-gradient-to-br ${stat.color} rounded-3xl p-6 shadow-[0_6px_0_rgba(0,0,0,0.2)] border-4 border-white hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all cursor-pointer`}>
                                    <div className="text-5xl mb-2 group-hover:scale-125 transition-transform">
                                        {stat.emoji}
                                    </div>
                                    <div className="text-white">
                                        <span className="text-3xl font-black drop-shadow-lg">{stat.value}</span>
                                        <p className="text-sm font-bold mt-1">{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section - Cartoon Style */}
            <section id="features" className="py-16 px-4 max-w-7xl mx-auto relative">
                <div className="text-center mb-12">
                    <h2
                        className="text-5xl md:text-6xl font-black text-white mb-4 inline-block"
                        style={{
                            textShadow: "4px 4px 0 rgba(0,0,0,0.2)",
                            transform: "rotate(-1deg)",
                        }}>
                        Why Kids & Students
                        <span className="block text-yellow-300">LOVE US! ❤️</span>
                    </h2>
                    <p className="text-xl text-white font-bold" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                        Everything you need in one awesome place! 🎯
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            emoji: "🧠",
                            icon: Brain,
                            title: "AI Super Brain",
                            description: "Get personalized word meanings, memorable sentences, and cool images!",
                            color: "from-purple-400 to-pink-500",
                            rotation: "rotate-2",
                        },
                        {
                            emoji: "⚡",
                            icon: Zap,
                            title: "Smart Memory",
                            description: "Review words at the perfect time - science-backed learning magic!",
                            color: "from-yellow-400 to-orange-500",
                            rotation: "-rotate-1",
                        },
                        {
                            emoji: "🎨",
                            icon: BookOpen,
                            title: "Picture Perfect",
                            description: "Learn with beautiful AI images that make words stick forever!",
                            color: "from-cyan-400 to-blue-500",
                            rotation: "rotate-1",
                        },
                        {
                            emoji: "🎮",
                            icon: Trophy,
                            title: "Fun Games",
                            description: "Play flashcards, quizzes, and challenges. Learning = Playing!",
                            color: "from-green-400 to-emerald-500",
                            rotation: "-rotate-2",
                        },
                        {
                            emoji: "📈",
                            icon: TrendingUp,
                            title: "Watch You Grow",
                            description: "Track your progress and watch your vocabulary explode! 🚀",
                            color: "from-pink-400 to-rose-500",
                            rotation: "rotate-1",
                        },
                        {
                            emoji: "🎁",
                            icon: Sparkles,
                            title: "FREE Forever",
                            description: "All features unlocked! No tricks, no ads, just pure learning fun!",
                            color: "from-indigo-400 to-purple-500",
                            rotation: "-rotate-1",
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className={`group relative bg-white rounded-3xl p-6 shadow-[0_8px_0_rgba(0,0,0,0.2)] border-4 border-black hover:shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all ${feature.rotation} hover:rotate-0 cursor-pointer overflow-hidden`}>
                            {/* Background gradient */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>

                            <div className="relative z-10">
                                <div className="text-6xl mb-3 group-hover:scale-125 transition-transform inline-block group-hover:rotate-12">
                                    {feature.emoji}
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-700 font-semibold leading-relaxed">{feature.description}</p>
                            </div>

                            {/* Corner decoration */}
                            <div
                                className={`absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br ${feature.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-md`}></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Progress Demo Section - Cartoon Style */}
            <section id="demo" className="py-16 px-4 max-w-6xl mx-auto relative">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_12px_0_rgba(0,0,0,0.2)] border-4 border-black -rotate-1 hover:rotate-0 transition-transform">
                    <div className="text-center mb-10">
                        <h2
                            className="text-5xl font-black text-gray-800 mb-4"
                            style={{ textShadow: "3px 3px 0 rgba(255,200,0,0.4)" }}>
                            Watch Yourself
                            <span className="block text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                                LEVEL UP! 🚀
                            </span>
                        </h2>
                        <p className="text-xl text-gray-700 font-bold">Track your amazing journey! 🌟</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Progress Visualization */}
                        <div className="space-y-6">
                            {[
                                {
                                    emoji: "📚",
                                    label: "Words Mastered",
                                    value: 87,
                                    color: "from-purple-500 to-pink-500",
                                    bgColor: "bg-purple-100",
                                },
                                {
                                    emoji: "🔥",
                                    label: "Daily Streak",
                                    value: 65,
                                    color: "from-yellow-500 to-orange-500",
                                    bgColor: "bg-yellow-100",
                                },
                                {
                                    emoji: "🎯",
                                    label: "Accuracy Rate",
                                    value: 92,
                                    color: "from-green-500 to-emerald-500",
                                    bgColor: "bg-green-100",
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className={`${item.bgColor} rounded-2xl p-4 border-3 border-gray-800 shadow-lg`}>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl">{item.emoji}</span>
                                            <span className="text-gray-800 font-black text-lg">{item.label}</span>
                                        </div>
                                        <span className="text-gray-800 font-black text-2xl">{item.value}%</span>
                                    </div>
                                    <div className="h-6 bg-white rounded-full overflow-hidden border-3 border-gray-800 shadow-inner">
                                        <div
                                            className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 flex items-center justify-end pr-2`}
                                            style={{ width: `${item.value}%` }}>
                                            <span className="text-white font-black text-xs">★</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Achievements - Cartoon Style */}
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black text-gray-800 mb-4 flex items-center gap-2">
                                <Trophy className="w-8 h-8 text-yellow-500 fill-yellow-400" />
                                Your Badges! 🎖️
                            </h3>
                            {[
                                {
                                    emoji: "🏆",
                                    title: "Week Warrior",
                                    desc: "7 day streak!",
                                    color: "from-yellow-400 to-orange-400",
                                    bgColor: "bg-yellow-50",
                                },
                                {
                                    emoji: "⚡",
                                    title: "Quick Learner",
                                    desc: "50 words mastered!",
                                    color: "from-purple-400 to-pink-400",
                                    bgColor: "bg-purple-50",
                                },
                                {
                                    emoji: "🌟",
                                    title: "Perfect Score",
                                    desc: "100% on quiz!",
                                    color: "from-green-400 to-emerald-400",
                                    bgColor: "bg-green-50",
                                },
                            ].map((achievement, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-4 ${achievement.bgColor} rounded-2xl p-4 border-3 border-gray-800 shadow-lg hover:scale-105 transition-transform cursor-pointer group`}>
                                    <div
                                        className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center text-3xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-white group-hover:rotate-12 transition-transform`}>
                                        {achievement.emoji}
                                    </div>
                                    <div>
                                        <h4 className="text-gray-800 font-black text-lg group-hover:text-purple-600 transition-colors">
                                            {achievement.title}
                                        </h4>
                                        <p className="text-gray-600 font-bold">{achievement.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section - Cartoon Style */}
            <section id="testimonials" className="py-16 px-4 max-w-6xl mx-auto relative">
                <div className="text-center mb-12">
                    <h2
                        className="text-5xl md:text-6xl font-black text-white mb-4"
                        style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.3)" }}>
                        Students Say We&apos;re
                        <span className="block text-yellow-300">AWESOME! 🌟</span>
                    </h2>
                    <p className="text-xl text-white font-bold" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                        Real stories from real learners! 💬
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            name: "Sarah",
                            age: "18",
                            role: "College Student",
                            avatar: "👧",
                            text: "I went from struggling with vocabulary to ACING my English exams! The visual learning is a total game-changer! 🎉",
                            color: "from-pink-400 to-rose-400",
                            bgColor: "bg-pink-50",
                            rotation: "rotate-2",
                        },
                        {
                            name: "Miguel",
                            age: "25",
                            role: "Professional",
                            avatar: "👨",
                            text: "As a busy professional, the spaced repetition keeps me learning efficiently. I mastered 500+ words in just 3 months! 🚀",
                            color: "from-blue-400 to-cyan-400",
                            bgColor: "bg-blue-50",
                            rotation: "-rotate-1",
                        },
                        {
                            name: "Yuki",
                            age: "16",
                            role: "High School Student",
                            avatar: "👩",
                            text: "The AI images help me remember words SO much better! It's actually FUN to learn now! Best app ever! ⭐",
                            color: "from-purple-400 to-pink-400",
                            bgColor: "bg-purple-50",
                            rotation: "rotate-1",
                        },
                    ].map((testimonial, i) => (
                        <div
                            key={i}
                            className={`bg-white rounded-3xl p-6 shadow-[0_8px_0_rgba(0,0,0,0.2)] border-4 border-black ${testimonial.rotation} hover:rotate-0 hover:scale-105 transition-all cursor-pointer group`}>
                            {/* Stars */}
                            <div className="flex gap-1 mb-4 justify-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Quote bubble */}
                            <div
                                className={`${testimonial.bgColor} rounded-2xl p-4 mb-4 border-3 border-gray-800 relative`}>
                                <p className="text-gray-800 font-bold leading-relaxed">
                                    &quot;{testimonial.text}&quot;
                                </p>
                                {/* Speech bubble tail */}
                                <div
                                    className={`absolute -bottom-2 left-8 w-4 h-4 ${testimonial.bgColor} border-b-3 border-r-3 border-gray-800 transform rotate-45`}></div>
                            </div>

                            {/* Avatar */}
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-16 h-16 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-3xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-3 border-white group-hover:scale-110 group-hover:rotate-12 transition-transform`}>
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <h4 className="text-gray-800 font-black text-lg">
                                        {testimonial.name}, {testimonial.age}
                                    </h4>
                                    <p className="text-gray-600 font-bold text-sm">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section - Super Cartoon Style */}
            <section id="cta" className="py-20 px-4 max-w-5xl mx-auto text-center relative">
                {/* Subtle decorative elements */}
                <div className="absolute -top-10 left-10 text-7xl opacity-20">🎉</div>
                <div className="absolute -top-5 right-10 text-7xl opacity-20">🚀</div>

                <div className="bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-500 rounded-[2.5rem] p-2 shadow-[0_16px_0_rgba(0,0,0,0.3)] hover:shadow-[0_12px_0_rgba(0,0,0,0.3)] hover:translate-y-1 transition-all border-4 border-black -rotate-1 hover:rotate-0">
                    <div className="bg-white rounded-[2rem] p-12 border-4 border-black">
                        <h2
                            className="text-5xl md:text-7xl font-black text-gray-800 mb-6 leading-tight mt-8"
                            style={{ textShadow: "4px 4px 0 rgba(255,200,0,0.5)" }}>
                            Ready to Be a
                            <span className="block text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text">
                                WORD MASTER?! 🏆
                            </span>
                        </h2>

                        <p className="text-2xl text-gray-700 font-black mb-4">
                            Join <span className="text-purple-600">10,000+ students</span> having a BLAST learning
                            English! 🎊
                        </p>

                        <p className="text-xl text-gray-600 font-bold mb-8">
                            Setup takes 2 minutes. Start learning in 30 seconds! ⚡
                        </p>

                        <div className="flex gap-4 justify-center flex-wrap mb-8">
                            <Button
                                onClick={onGetStarted}
                                size="lg"
                                className="bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 font-black text-2xl px-12 py-8 rounded-full shadow-[0_8px_0_rgba(0,0,0,0.3)] border-4 border-black hover:shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:translate-y-1 transition-all group">
                                <Rocket className="mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                LET&apos;S GO! IT&apos;S FREE! 🎉
                            </Button>
                        </div>

                        {/* Trust badges - cartoon style */}
                        <div className="flex gap-4 justify-center flex-wrap">
                            {[
                                { emoji: "💳", text: "No Credit Card!", color: "from-blue-400 to-cyan-400" },
                                { emoji: "🎁", text: "100% FREE!", color: "from-green-400 to-emerald-400" },
                                { emoji: "⚡", text: "Super Quick!", color: "from-yellow-400 to-orange-400" },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-2 bg-gradient-to-r ${item.color} px-6 py-3 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] border-3 border-black hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 transition-all group cursor-pointer`}>
                                    <span className="text-2xl group-hover:scale-125 transition-transform">
                                        {item.emoji}
                                    </span>
                                    <span className="font-black text-white text-sm">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Extra encouragement */}
                        <div className="mt-8 inline-block">
                            <div className="bg-yellow-200 border-4 border-black rounded-2xl px-6 py-3 shadow-lg rotate-1 hover:rotate-0 transition-transform">
                                <p className="text-gray-800 font-black text-lg">
                                    ⏰ Join NOW and start your first lesson today!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HeroSection;
