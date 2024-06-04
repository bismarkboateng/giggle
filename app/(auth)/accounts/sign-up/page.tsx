"use client"

import {
  Card, CardBody, Button,
  Input
} from "@nextui-org/react";
import { TbEyeFilled } from "react-icons/tb";
import { IoEyeOffSharp } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { ChangeEvent, FormEvent, useState } from "react"
import { checkUser, createUser } from "@/actions/user.actions";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [isPVisible, setIsPVisible] = useState(false);
  const [isCPVisible, setIsCPVisible] = useState(false);
  const [isFieldEmpty, setIsFieldEmpty] = useState("")
  const [signUpState, setSignUpState] = useState("")
  const [userExist, setUserExist] = useState("")
  const [passwordDoesNotMatch, setPasswordDoesNotMatch] = useState("")

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const toggleVisibility = () => setIsPVisible(!isPVisible);
  const toggleCPVisibility = () => setIsCPVisible(!isCPVisible);

  const handleGoogleSignUp = () => {
    console.log("google sign up")
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setIsFieldEmpty("")
    setPasswordDoesNotMatch("")
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit =  async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { username, email, password, confirmPassword } = formData
    if (username === "" || email === "" || password === "" || confirmPassword === "") {
     setIsFieldEmpty("Please fill in all fields")
     return 
    }

    if (password !== confirmPassword) {
      setPasswordDoesNotMatch("Passwords do not match")
     return
    }

    const user = await checkUser(email)
    const isUserExist = JSON.parse(user).isUserExist

    if (isUserExist) {
      setUserExist("User with this email already exists. Please sign in")
      return
    }

    try {
      setSignUpState("loading")
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await createUser({
        username,
        email,
        authId: userCredential.user.uid
      })
      setSignUpState("success")
      console.log("send email to user")
      router.push("/accounts/sign-in")
    } catch (error) {
      throw error
    }
  }


  return (
    <section className="mt-10 px-5">
      <h1 className="text-2xl text-[#EEF1F3] font-bold">Sign Up</h1>
      <p className="mt-1 text-[#F2F2F2]">
       By continuing, you agree to our <span className="text-primary-color">User Agreement</span>
      </p>
      <p className="text-[#F2F2F2]">and acknowledge that you understand the <span className="text-primary-color">Privacy Policy</span></p>

      <Card className="bg-white text-black px-1 cursor-pointer mt-5">
       <CardBody onClick={handleGoogleSignUp}>
        <div className="flex items-center">
         <FcGoogle fontSize={22} />
         <p className="ml-14">Continue with Google</p>
        </div>
       </CardBody>
      </Card>
      <div className="flex items-center gap-2">
       <div className="h-[1px] w-full bg-[#303030]" />
       <p className="text-center my-5 text-[#F2F2F2]">OR</p>
       <div className="h-[1px] w-full bg-[#303030]" />
      </div>

      <section className="mt-3 w-full">
       <form onSubmit={handleSubmit}>
        <div>
         <Input
          isRequired
          type="text"
          label="Username"
          placeholder="@username"
          className="w-full"
          onChange={handleChange}
          value={formData.username}
          name="username"
         />
        </div>
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

        <div className="mt-3">
         <Input
          isRequired
          label="Confirm Password"
          placeholder="Enter your password"
          name="confirmPassword"
          onChange={handleChange}
          value={formData.confirmPassword}
          endContent={
           <button className="focus:outline-none" type="button" onClick={toggleCPVisibility}>
            {isCPVisible ? (
              <TbEyeFilled className="text-2xl text-default-400 pointer-events-none" />
            ) : (
             <IoEyeOffSharp className="text-2xl text-default-400 pointer-events-none" />
            )}
           </button>
          }
          type={isCPVisible ? "text" : "password"}
          className="w-full focus:outline-none bg-[#27272A] outline-none rounded-xl"
         />
        </div>

        <Button type="submit"
         className="w-full bg-[#D93900] mt-3 py-6 font-bold"
         disabled={signUpState === "loading"}
         isLoading={signUpState === "loading"}
        >
         Sign Up
        </Button>
       </form>
      </section>
      {isFieldEmpty && <p className="text-center text-red-500 mt-2">{isFieldEmpty}</p>}
      {passwordDoesNotMatch && <p className="text-center text-red-500 mt-2">{passwordDoesNotMatch}</p>}
      {userExist && <p className="text-center text-red-500 mt-2">{userExist}</p>}
    </section>
  )
}
