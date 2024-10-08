"use client";
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation';



export default function Signin() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            if (response.ok) {
                router.push('/');
            }
        } catch (e) {

        }
    }

    return (
        <>
            <div className="flex w-full">
                <div className="flex w-2/5 bg-orange-600"></div>
                <div className="relative flex flex-grow bg-orange-200 rounded-b-3xl border-b border-orange-600">
                    <h1 className="absolute left-5 top-3 text-orange-600 font-extrabold text-3xl">Sign In</h1>

                    <div className="m-auto w-full max-w-lg bg-orange-600 shadow py-9 px-6 rounded">
                        <form onSubmit={handleSubmit}>
                            <label>
                                <span className='block text-lg font-bold text-orange-200'>User name</span>
                                <input
                                    required
                                    className='mt-1 px-3 py-2 w-full bg-white shadow-sm rounded focus:outline-none focus:ring-4 focus:ring-orange-200'
                                    placeholder='Input your user name'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </label>
                            <label>
                                <span className='block text-lg font-bold text-orange-200'>Password</span>
                                <input
                                    required
                                    className='mt-1 px-3 py-2 w-full bg-white shadow-sm rounded focus:outline-none focus:ring-4 focus:ring-orange-200'
                                    placeholder='Input your password'
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>
                            <div className='mt-2'>
                                <button
                                    className='rounded bg-orange-200 w-full mt-4 py-1.5 text-orange-600 font-extrabold text-2xl hover:brightness-95 active:brightness-90'
                                    type="submit"
                                >Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
