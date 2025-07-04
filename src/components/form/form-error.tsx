import { TriangleAlert } from "lucide-react";

type FormErrorProps = {
  message?: string;
};

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return (
    <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-4 text-sm text-destructive'>
      <TriangleAlert size={40} />
      <p>{message}</p>
    </div>
  );
};
