'use client';

export function AuthPage ({isSignIn}: {
    isSignIn: boolean
}) {
    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="p-2 m-2 bg-white text-black rounded">
            <div className="p-1 border-black border-2">
                <input type="text" placeholder="Email"/>
            </div>
            <div className="p-1 mt-2 border-black border-2">
                <input type="password" placeholder="Password"/>
            </div>
            <div className="mt-4 flex justify-center border-black border-2 cursor-pointer">
                <button onClick={() => {
                    
                }}> {isSignIn ? "Sign In" : "Sign Up"}</button>
            </div>
        </div>
    </div>
}