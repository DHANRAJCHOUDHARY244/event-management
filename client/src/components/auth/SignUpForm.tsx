import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import apiClient from "../../api/apiClient";
import useAuthStore from "../../store/authStore";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const { login } = useAuthStore.getState();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    isChecked: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fname.trim()) newErrors.fname = "First name is required";
    if (!form.lname.trim()) newErrors.lname = "Last name is required";
    if (!form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      newErrors.email = "Invalid email address";
    if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.isChecked)
      newErrors.isChecked = "You must agree to terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await apiClient.post({
        url: "/register.php",
        data: {
          fname: form.fname,
          lname: form.lname,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        },
      });
      setSuccessMsg(res.data.message);
      if (res.data.token){
        setForm({
          fname: "",
          lname: "",
          email: "",
          password: "",
          confirmPassword: "",
          isChecked: false,
        });
        login(res.data.token, res.data.user);
        navigate("/",{ replace: true })
      }
    } catch (err: any) {
      if (err.response?.data?.errors)
        setErrors(err.response.data.errors.reduce((acc: any, val: any) => ({ ...acc, [val]: val }), {}));
      else
        setErrors({ general: err.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Sign Up
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Enter your email and password to sign up!
        </p>

        {errors.general && <p className="text-error-500 mb-2">{errors.general}</p>}
        {successMsg && <p className="text-success-500 mb-2">{successMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>First Name<span className="text-error-500">*</span></Label>
                <Input
                  type="text"
                  name="fname"
                  placeholder="Enter your first name"
                  value={form.fname}
                  onChange={handleChange}
                  error={!!errors.fname}
                  hint={errors.fname}
                />
              </div>
              <div>
                <Label>Last Name<span className="text-error-500">*</span></Label>
                <Input
                  type="text"
                  name="lname"
                  placeholder="Enter your last name"
                  value={form.lname}
                  onChange={handleChange}
                  error={!!errors.lname}
                  hint={errors.lname}
                />
              </div>
            </div>

            <div>
              <Label>Email<span className="text-error-500">*</span></Label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                error={!!errors.email}
                hint={errors.email}
              />
            </div>

            <div>
              <Label>Password<span className="text-error-500">*</span></Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  hint={errors.password}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? <EyeIcon className="size-5" /> : <EyeCloseIcon className="size-5" />}
                </span>
              </div>
            </div>

            <div>
              <Label>Confirm Password<span className="text-error-500">*</span></Label>
              <Input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                hint={errors.confirmPassword}
              />
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                checked={form.isChecked}
                onChange={(val) => setForm((prev) => ({ ...prev, isChecked: val }))}
              />
              <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                By creating an account you agree to our{" "}
                <span className="text-gray-800 dark:text-white/90">Terms and Conditions</span> and{" "}
                <span className="text-gray-800 dark:text-white">Privacy Policy</span>
              </p>
            </div>
            {errors.isChecked && <p className="text-error-500 text-xs">{errors.isChecked}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </div>
        </form>

        <p className="mt-5 text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
          Already have an account?{" "}
          <Link to="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
