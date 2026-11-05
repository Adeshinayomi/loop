import {Mail,Eye,EyeOff} from 'lucide-react'
export function AuthForm(){
    return(
        <form className="grid gap-10">
            <p className="text-sm text-secondary">New around here? <span className="text-accent">Join Loop</span></p>

            <div className="grid gap-2">
                <span className="text-xs font-extrabold text-accent tracking-wider">WELCOME BACK TO LOOP</span>
                <h1 className="text-2xl font-bold text-foreground">Pick up where you left off.</h1>
                <p className="text-sm text-secondary">Your people, your conversation, your daily inspiration</p>
            </div>

            <div className="grid gap-5">
                <div className="grid gap-2 relative">
                    <Mail className="absolute left-3 top-10 text-secondary" size={20}/>
                    <label htmlFor="email" className="text-sm font-bold text-foreground">Email address</label>
                    <input type="email" placeholder="jhondoe@gmail.com" className="border border-stroke px-10 py-2 rounded-lg bg-surface placeholder:text-secondary placeholder:text-sm"/>
                </div>

                <div className="grid gap-2 relative">
                    <label htmlFor="password" className="text-sm font-bold text-foreground">Password</label>
                    <input type="password" placeholder="••••••••" className="border border-stroke px-4 py-2 rounded-lg bg-surface placeholder:text-secondary placeholder:text-lg"/>
                    <div className="relative">
                        <Eye className="absolute right-3 bottom-4 text-secondary" size={20}/>
                        <EyeOff className="absolute right-3 bottom-4 text-secondary" size={20}/>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <div className="flex gap-2">
                    <input type="checkbox" name="remember" className="checked:bg-accent" />
                    <label htmlFor="remember" className="text-sm">Remember me</label>
                </div>
                
                <span className="text-sm text-accent font-bold">forgot password?</span>
            </div>

            <button className="py-2 rounded-full text-md bg-accent text-White">Sign in</button>
        </form>
    )
}