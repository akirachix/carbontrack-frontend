export const fetchSignup = async (formData: {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  user_type: "factory" | "manager";
  factory?: string;
}) => {
  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(data)); 
    }

    return data;
  } catch (error) {
    throw error;
  }
};