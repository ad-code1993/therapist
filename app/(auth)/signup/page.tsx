"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import Image from "next/image";
import { Loader2, X, ArrowLeft, User, Stethoscope } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Role = "therapist" | "patient";
type Step = "basic" | "therapist" | "patient";

interface BasicInfo {
	name: string;
	email: string;
	role: Role;
}

interface TherapistInfo {
	phone_number: string;
	qualification: string;
	description: string;
	location: string;
	hourly_rate: number;
	age: number;
	gender: "male" | "female" | "non_binary" | "other";
	profile_picture?: string;
}

interface PatientInfo {
	user_name: string;
	phone_number: string;
	gender: "male" | "female" | "non_binary" | "other";
	age: number;
	pref_gender: "male" | "female" | "non_binary" | "other";
	description: string;
}

export default function SignUp() {
	const [currentStep, setCurrentStep] = useState<Step>("basic");
	const [basicInfo, setBasicInfo] = useState<BasicInfo>({
		name: "",
		email: "",
		role: "patient"
	});
	const [therapistInfo, setTherapistInfo] = useState<TherapistInfo>({
		phone_number: "",
		qualification: "",
		description: "",
		location: "",
		hourly_rate: 0,
		age: 0,
		gender: "other"
	});
	const [patientInfo, setPatientInfo] = useState<PatientInfo>({
		user_name: "",
		phone_number: "",
		gender: "other",
		age: 0,
		pref_gender: "other",
		description: ""
	});
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleBasicInfoSubmit = () => {
		if (!basicInfo.name || !basicInfo.email || !basicInfo.role) {
			toast.error("Please fill in all required fields");
			return;
		}
		setCurrentStep(basicInfo.role);
	};

	const handleTherapistInfoChange = (field: keyof TherapistInfo, value: any) => {
		setTherapistInfo(prev => ({ ...prev, [field]: value }));
	};

	const handlePatientInfoChange = (field: keyof PatientInfo, value: any) => {
		setPatientInfo(prev => ({ ...prev, [field]: value }));
	};

	const handleFinalSubmit = async () => {
		if (!password || password !== passwordConfirmation) {
			toast.error("Passwords do not match");
			return;
		}

		setLoading(true);
		try {
			// Combine basic info with role-specific info
			const userData = {
				...basicInfo,
				...(basicInfo.role === "therapist" ? therapistInfo : patientInfo),
				password,
				image: image ? await convertImageToBase64(image) : ""
			};

			await signUp.email({
				email: basicInfo.email,
				password,
				name: basicInfo.name,
				image: userData.image,
				callbackURL: "/dashboard",
				fetchOptions: {
					onResponse: () => {
						setLoading(false);
					},
					onRequest: () => {
						setLoading(true);
					},
					onError: (ctx) => {
						toast.error(ctx.error.message);
						setLoading(false);
					},
					onSuccess: async () => {
						router.push("/dashboard");
					},
				},
			});
		} catch (error) {
			toast.error("An error occurred during signup");
			setLoading(false);
		}
	};

	const renderBasicInfoStep = () => (
		<div className="grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="name">Full Name</Label>
				<Input
					id="name"
					placeholder="John Doe"
					required
					onChange={(e) => setBasicInfo(prev => ({ ...prev, name: e.target.value }))}
					value={basicInfo.name}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					placeholder="john@example.com"
					required
					onChange={(e) => setBasicInfo(prev => ({ ...prev, email: e.target.value }))}
					value={basicInfo.email}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="role">I am a</Label>
				<select
					id="role"
					value={basicInfo.role}
					onChange={(e) => setBasicInfo(prev => ({ ...prev, role: e.target.value as Role }))}
					className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<option value="patient">Patient</option>
					<option value="therapist">Therapist</option>
				</select>
			</div>
			<Button onClick={handleBasicInfoSubmit} className="w-full">
				Continue
			</Button>
		</div>
	);

	const renderTherapistForm = () => (
		<div className="grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="phone_number">Phone Number</Label>
				<Input
					id="phone_number"
					placeholder="+1 (555) 123-4567"
					required
					onChange={(e) => handleTherapistInfoChange('phone_number', e.target.value)}
					value={therapistInfo.phone_number}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="qualification">Qualification</Label>
				<Input
					id="qualification"
					placeholder="Ph.D. in Clinical Psychology, Stanford University"
					required
					onChange={(e) => handleTherapistInfoChange('qualification', e.target.value)}
					value={therapistInfo.qualification}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="description">Professional Description</Label>
				<Textarea
					id="description"
					placeholder="Tell clients about your approach and experience..."
					rows={3}
					onChange={(e) => handleTherapistInfoChange('description', e.target.value)}
					value={therapistInfo.description}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="location">Location</Label>
				<Input
					id="location"
					placeholder="San Francisco, CA"
					required
					onChange={(e) => handleTherapistInfoChange('location', e.target.value)}
					value={therapistInfo.location}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
				<Input
					id="hourly_rate"
					type="number"
					placeholder="150"
					required
					onChange={(e) => handleTherapistInfoChange('hourly_rate', parseInt(e.target.value))}
					value={therapistInfo.hourly_rate}
				/>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div className="grid gap-2">
					<Label htmlFor="age">Age</Label>
					<Input
						id="age"
						type="number"
						placeholder="35"
						required
						onChange={(e) => handleTherapistInfoChange('age', parseInt(e.target.value))}
						value={therapistInfo.age}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="gender">Gender</Label>
					<select
						id="gender"
						value={therapistInfo.gender}
						onChange={(e) => handleTherapistInfoChange('gender', e.target.value)}
						className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="male">Male</option>
						<option value="female">Female</option>
						<option value="non_binary">Non-binary</option>
						<option value="other">Other</option>
					</select>
				</div>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="profile_picture">Profile Picture (optional)</Label>
				<div className="flex items-end gap-4">
					{imagePreview && (
						<div className="relative w-16 h-16 rounded-sm overflow-hidden">
							<Image
								src={imagePreview}
								alt="Profile preview"
								layout="fill"
								objectFit="cover"
							/>
						</div>
					)}
					<div className="flex items-center gap-2 w-full">
						<Input
							id="profile_picture"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="w-full"
						/>
						{imagePreview && (
							<X
								className="cursor-pointer"
								onClick={() => {
									setImage(null);
									setImagePreview(null);
								}}
							/>
						)}
					</div>
				</div>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					autoComplete="new-password"
					placeholder="Password"
					required
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="password_confirmation">Confirm Password</Label>
				<Input
					id="password_confirmation"
					type="password"
					value={passwordConfirmation}
					onChange={(e) => setPasswordConfirmation(e.target.value)}
					autoComplete="new-password"
					placeholder="Confirm Password"
					required
				/>
			</div>
			<Button
				type="submit"
				className="w-full"
				disabled={loading}
				onClick={handleFinalSubmit}
			>
				{loading ? (
					<Loader2 size={16} className="animate-spin" />
				) : (
					"Create Therapist Account"
				)}
			</Button>
		</div>
	);

	const renderPatientForm = () => (
		<div className="grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="user_name">Username</Label>
				<Input
					id="user_name"
					placeholder="johndoe"
					required
					onChange={(e) => handlePatientInfoChange('user_name', e.target.value)}
					value={patientInfo.user_name}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="phone_number">Phone Number</Label>
				<Input
					id="phone_number"
					placeholder="+1 (555) 123-4567"
					required
					onChange={(e) => handlePatientInfoChange('phone_number', e.target.value)}
					value={patientInfo.phone_number}
				/>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div className="grid gap-2">
					<Label htmlFor="age">Age</Label>
					<Input
						id="age"
						type="number"
						placeholder="25"
						required
						onChange={(e) => handlePatientInfoChange('age', parseInt(e.target.value))}
						value={patientInfo.age}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="gender">Gender</Label>
					<select
						id="gender"
						value={patientInfo.gender}
						onChange={(e) => handlePatientInfoChange('gender', e.target.value)}
						className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="male">Male</option>
						<option value="female">Female</option>
						<option value="non_binary">Non-binary</option>
						<option value="other">Other</option>
					</select>
				</div>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="pref_gender">Preferred Therapist Gender</Label>
				<select
					id="pref_gender"
					value={patientInfo.pref_gender}
					onChange={(e) => handlePatientInfoChange('pref_gender', e.target.value)}
					className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<option value="male">Male</option>
					<option value="female">Female</option>
					<option value="non_binary">Non-binary</option>
					<option value="other">No Preference</option>
				</select>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="description">Tell us about yourself (optional)</Label>
				<Textarea
					id="description"
					placeholder="Share any relevant information about your therapy needs..."
					rows={3}
					onChange={(e) => handlePatientInfoChange('description', e.target.value)}
					value={patientInfo.description}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					autoComplete="new-password"
					placeholder="Password"
					required
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="password_confirmation">Confirm Password</Label>
				<Input
					id="password_confirmation"
					type="password"
					value={passwordConfirmation}
					onChange={(e) => setPasswordConfirmation(e.target.value)}
					autoComplete="new-password"
					placeholder="Confirm Password"
					required
				/>
			</div>
			<Button
				type="submit"
				className="w-full"
				disabled={loading}
				onClick={handleFinalSubmit}
			>
				{loading ? (
					<Loader2 size={16} className="animate-spin" />
				) : (
					"Create Patient Account"
				)}
			</Button>
		</div>
	);

	const getStepTitle = () => {
		switch (currentStep) {
			case "basic":
				return "Create Account";
			case "therapist":
				return "Therapist Information";
			case "patient":
				return "Patient Information";
			default:
				return "Sign Up";
		}
	};

	const getStepDescription = () => {
		switch (currentStep) {
			case "basic":
				return "Enter your basic information to get started";
			case "therapist":
				return "Tell us about your professional background";
			case "patient":
				return "Help us understand your therapy needs";
			default:
				return "Enter your information to create an account";
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
			<Card className="z-50 rounded-md rounded-t-none max-w-md w-full shadow-xl">
				<CardHeader>
					{currentStep !== "basic" && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setCurrentStep("basic")}
							className="w-fit p-0 h-auto mb-2"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back
						</Button>
					)}
					<div className="flex items-center gap-2">
						{currentStep === "therapist" ? (
							<Stethoscope className="h-5 w-5 text-blue-600" />
						) : currentStep === "patient" ? (
							<User className="h-5 w-5 text-green-600" />
						) : null}
						<CardTitle className="text-lg md:text-xl">{getStepTitle()}</CardTitle>
					</div>
					<CardDescription className="text-xs md:text-sm">
						{getStepDescription()}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{currentStep === "basic" && renderBasicInfoStep()}
					{currentStep === "therapist" && renderTherapistForm()}
					{currentStep === "patient" && renderPatientForm()}
				</CardContent>
				<CardFooter>
					<div className="flex justify-center w-full border-t py-4">
						<p className="text-center text-xs text-neutral-500">
							Secured by <span className="text-orange-400">better-auth.</span>
						</p>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}