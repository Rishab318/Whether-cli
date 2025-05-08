import { formPreservedData } from "@/Redux/Reducers/SharedData/SharedDataSlice";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const PreserveForm = () => {
  const dispatch = useDispatch();

  // Grab values and submitForm from context
  const { values } = useFormikContext();
  useEffect(() => {
    if (values) {
      // Store the form values in localStorage
      dispatch(formPreservedData(values));
    }
  }, [values]);
  return null;
};
export default PreserveForm;
