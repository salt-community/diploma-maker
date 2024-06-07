import { useForm, FieldValues } from "react-hook-form";

type FormData = {
    classname: string;
    datebootcamp: string;
    names: string[];
};

type Props = {
  SetFormInfo: (data: any) => void;
};

export default function AddDiplomaForm({ SetFormInfo }: Props) {
  const { register, handleSubmit } = useForm<FormData>();

    function submitAndMakePDF(data: FieldValues){
        console.log(data.names);
        // updateStudentNames(data.names);
        const formData: FormData = {
            classname: data.classname,
            datebootcamp: data.datebootcamp,
            names: data.names.split('\n').map(name => name.trim()).filter(name => name !== "")
        }
        console.log(formData);
        SetFormInfo(formData);
    }

  return (
    <form
      onSubmit={handleSubmit((data) => {
        submitAndMakePDF(data);
      })}
      className="space-y-4 p-6 bg-white rounded shadow-md"
    >
      <div>
        <label htmlFor="classname" className="block text-sm font-medium text-gray-700">
          Class Name
        </label>
        <select
          id="classname"
          {...register("classname")}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value=".Net Fullstack">Dotnet</option>
          <option value="Java Fullstack">Java</option>
          <option value="Javascript Fullstack">JavaScript</option>
        </select>
      </div>

      <div>
        <label htmlFor="datebootcamp" className="block text-sm font-medium text-gray-700">
          Date of Bootcamp
        </label>
        <input
          id="datebootcamp"
          {...register("datebootcamp")}
          type="date"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="names" className="block text-sm font-medium text-gray-700">
          Student Names
        </label>
        <textarea
          id="names"
          {...register("names")}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Apply
        </button>
      </div>
    </form>
  );
}
