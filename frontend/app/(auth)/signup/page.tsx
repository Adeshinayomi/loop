import Image from "next/image";
import { AuthForm } from "@/app/components/AuthForm";

export default function SignIn(){
    return(
        <section className="w-full px-5 grid gap-7">
            <div className="w-full grid gap-4">
                <div className="relative">
                    <Image 
                        src='/Lifestyle-backdrop-mobile.png'
                        alt="Lifestyle-backdrop-image"
                        width={100}
                        height={100}
                        loading="eager"
                        className="w-full h-auto rounded-xl"
                    />

                    <div className="flex flex-col gap-2 absolute top-0 h-full bg-gradient-to-t from-bottom-gradient to-top-gradient px-4 justify-end pb-5 rounded-xl">
                        <h1 className="w-2/3 text-2xl font-light text-White tracking-wide">
                            Your People. Your perspective. <br /> Your little corner.
                        </h1>
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <Image 
                                    src='/Avatar-1.png'
                                    alt="Avatar-image"
                                    width={30}
                                    height={30}
                                    loading="eager"
                                    className="object-cover"
                                />
                                <Image 
                                    src='/Avatar-2.png'
                                    alt="Avatar-image"
                                    width={30}
                                    height={30}
                                    loading="eager"
                                    className="object-cover relative right-2"
                                />
                                <Image 
                                    src='/Avatar-3.png'
                                    alt="Avatar-image"
                                    width={30}
                                    height={30}
                                    loading="eager"
                                    className="object-cover relative right-4"
                                />                            
                            </div>
                            <p className="text-sm text-White/75">Good company start here.</p>
                        </div>
                    </div>
                </div>

                <p className="text-sm/5 text-secondary tracking-wider">
                    A place for what’s on your mind, what catches your eye, and the people who get you.
                </p>
            </div>

            <AuthForm />
        </section>
    )
}