"use client"

import { Button, Input} from "@nextui-org/react";
import { TbEyeFilled } from "react-icons/tb";
import { IoEyeOffSharp } from "react-icons/io5";
import { ChangeEvent, FormEvent, useState } from "react"
import { checkUser, setUserId } from "@/actions/user.actions";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function SignIn() {
  const [isPVisible, setIsPVisible] = useState(false);
  const [isFieldEmpty, setIsFieldEmpty] = useState("")
  const [signInState, setSignInState] = useState("")
  const [userExist, setUserExist] = useState("")
  const [error, setError] = useState("")
  const [passwordDoesNotMatch, setPasswordDoesNotMatch] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()

  const toggleVisibility = () => setIsPVisible(!isPVisible);


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setIsFieldEmpty("")
    setPasswordDoesNotMatch("")
    setUserExist("")
    setError("")
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit =  async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { email, password } = formData
    if (email === "" || password === "") {
     setIsFieldEmpty("Please fill in all fields")
     return 
    }

    const user = await checkUser(email)
    const isUserExist = JSON.parse(user).isUserExist
    const currentUser: UserFromDb = JSON.parse(user).currentUser
      
    if (!isUserExist) {
      setUserExist("This emails does not exist. Please sign up")
      return
    }

    try {
      setSignInState("loading")
      await signInWithEmailAndPassword(auth, email, password)
      setUserId(currentUser._id)
      setSignInState("success")
      router.push("/onboarding")
    } catch (error) {
      setError("Something went wrong, Please try again")
      setSignInState("")
    }
  }


  return (
    <section className="mt-10 px-5 md:px-32 lg:px-60 xl:px-[450px] bg-black">
      <h1 className="text-2xl 2xl:text-3xl text-[#EEF1F3] font-bold">Sign In</h1>
      <p className="mt-1 text-[#F2F2F2] 2xl:text-lg">
       By continuing, you agree to our <span className="text-[#648EFC]">User Agreement</span>
      </p>
      <p className="text-[#F2F2F2]">and acknowledge that you understand the <span className="text-[#648EFC]">Privacy Policy</span></p>

      <section className="mt-20 w-full">
       <form onSubmit={handleSubmit}>
        <div className="mt-3">
         <Input
          isRequired
          type="email"
          label="Email"
          placeholder="name@example.com"
          className="w-full"
          onChange={handleChange}
          value={formData.email}
          name="email"
         />
        </div>
        <div className="mt-3">
         <Input
          isRequired
          label="Password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          placeholder="Enter your password"
          endContent={
           <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
            {isPVisible ? (
              <TbEyeFilled className="text-2xl text-default-400 pointer-events-none" />
            ) : (
             <IoEyeOffSharp className="text-2xl text-default-400 pointer-events-none" />
            )}
           </button>
          }
          type={isPVisible ? "text" : "password"}
          className="w-full focus:outline-none bg-[#27272A] outline-none rounded-xl"
         />
        </div>

        <Button type="submit"
         className="w-full bg-[#D93900] mt-3 py-6 font-bold"
         disabled={signInState === "loading"}
         isLoading={signInState === "loading"}
        >
         Sign In
        </Button>
       </form>
      </section>
      {isFieldEmpty && <p className="text-center text-red-500 mt-2">{isFieldEmpty}</p>}
      {passwordDoesNotMatch && <p className="text-center text-red-500 mt-2">{passwordDoesNotMatch}</p>}
      {userExist && <p className="text-center text-red-500 mt-2">{userExist}</p>}
      {error && <p className="text-center text-red-500 mt-2">{error}</p>}

      <div className="mt-10">
        <p>New to Giggle? <Link href="/accounts/sign-up" className="text-[#648EFC] underline">Sign Up</Link></p>
      </div>
    </section>
  )
}