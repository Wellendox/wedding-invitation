import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useRef } from "react";
import { Card } from "primereact/card";
import { classNames } from "primereact/utils";
import { Checkbox } from "primereact/checkbox";
import ApiFormData from "@/types/ApiFormData";

interface DeclineFormModalProps {
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeclineFormModal: React.FC<DeclineFormModalProps> = ({
  showDialog,
  setShowDialog,
}) => {
  const toast = useRef<Toast>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onHide = () => {
    setShowDialog(false);
  };

  const onSubmit = async (formData: any) => {
    try {
      const data = formData as ApiFormData;
      data.declined = true;
      const payload = JSON.stringify(formData);
      const response = await fetch("/api/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      if (!response.ok) {
        toast.current?.show({
          severity: "error",
          summary: "Fehler beim verschicken des Formulars",
          detail: "Fehler",
        });
        throw new Error("Failed to submit the form");
      }
      const responseData = await response.json();

      toast.current?.show({
        severity: "success",
        summary: `Abgemeldet`,
        detail: `Du hast dich erfolgreich abgemeldet ${responseData.result}! Schade drum.`,
      });
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const getFormErrorMessage = (name: any) => {
    const error = errors[name];
    if (typeof error === "string") {
      return <small className="p-error">{error}</small>;
    } else if (error instanceof Object && "message" in error) {
      return <small className="p-error">{error.message?.toString()}</small>;
    }
    return null;
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="p-4 ">
        <Dialog
          className="min-w-80"
          header="Gäste Formular"
          visible={showDialog}
          onHide={onHide}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card title="Persönliche Informationen">
              {/* Firstname Lastname */}
              <div className="field mb-2">
                <label
                  htmlFor="name"
                  className={classNames({ "p-error": errors.name }, "mr-4")}
                >
                  Vorname Nachname
                </label>
                <br />
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Vorname Nachname ist ein Pflichtfeld.",
                  }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <br />
                {getFormErrorMessage("name")}
              </div>
              {/* E-Mail */}
              <div className="field">
                <label
                  htmlFor="email"
                  className={classNames({ "p-error": errors.name }, "mr-4")}
                >
                  E-Mail
                </label>
                <br />
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "E-Mail ist ein Pflichtfeld.",
                  }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <br />
                {getFormErrorMessage("email")}
              </div>
              <Button
                type="submit"
                label="Abschicken"
                className="mt-4 p-button-text mb-4 mr-8 bg-green-200 hover:bg-green-400 text-black font-bold py-2 px-4 rounded"
              />
            </Card>
          </form>
        </Dialog>
      </div>
    </>
  );
};

export default DeclineFormModal;
