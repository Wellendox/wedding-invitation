import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useRef } from "react";
import { Card } from "primereact/card";
import { classNames } from "primereact/utils";
import { Checkbox } from "primereact/checkbox";

interface SignupFormModalProps {
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupFormModal: React.FC<SignupFormModalProps> = ({
  showDialog,
  setShowDialog,
}) => {
  const toast = useRef<Toast>(null);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "companions",
  });

  const onHide = () => {
    setShowDialog(false);
  };

  const onSubmit = async (formData: any) => {
    try {
      const data = JSON.stringify(formData);
      const response = await fetch("/api/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
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
      const reply =
        formData.companions.length == 0
          ? `Du hast dich erfolgreich angemeldet ${responseData.result}! Wir sehen uns dann auf der Hochzeit.`
          : `Du und die Begleitpersonen haben sich erfolgreich angemeldet ${responseData.result}! Wir sehen uns dann auf der Hochzeit.`;

      toast.current?.show({
        severity: "success",
        summary: `Registriert`,
        detail: reply,
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
              {/* Vegetarian */}
              <div className="field mb-2">
                <span className="p-float-label">
                  <Controller
                    name="vegetarian"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Checkbox
                        inputId={field.name}
                        checked={field.value}
                        inputRef={field.ref}
                        className={classNames({
                          "p-invalid mr-1": fieldState.error,
                        })}
                        onChange={(e) => field.onChange(e.checked)}
                      />
                    )}
                  />
                  <label
                    htmlFor="vegetarian"
                    className={classNames(
                      { "p-error": errors.vegetarian },
                      "ml-2"
                    )}
                  >
                    Vegetarier
                  </label>
                </span>
              </div>
              {/* Vegan */}
              <div className="field mb-2">
                <Controller
                  name="vegan"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Checkbox
                      inputId={field.name}
                      checked={field.value}
                      inputRef={field.ref}
                      className={classNames({
                        "p-invalid": fieldState.error,
                      })}
                      onChange={(e) => {
                        field.onChange(e.checked);
                        e.checked
                          ? setValue("vegetarian", true)
                          : setValue("vegetarian", false);
                      }}
                    />
                  )}
                />
                <label
                  htmlFor="vegan"
                  className={classNames({ "p-error": errors.vegan }, "ml-1")}
                >
                  Veganer
                </label>
              </div>
              {/* Hotel */}
              <div className="field mb-2">
                <Controller
                  name="hotel"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Checkbox
                      inputId={field.name}
                      checked={field.value}
                      inputRef={field.ref}
                      className={classNames({
                        "p-invalid": fieldState.error,
                      })}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                  )}
                />
                <label
                  htmlFor="vegan"
                  className={classNames({ "p-error": errors.vegan }, "ml-1")}
                >
                  Hotel*
                </label>
                <p className="text-xs mt-2">*Nur noch X Plätze verfügbar</p>
              </div>
            </Card>
            {/* Companions */}
            {fields.map((companion, index) => (
              <Card
                title={`Begleitung ${index + 1}`}
                key={companion.id}
                className="mt-4"
              >
                <div className="field mb-2">
                  <label htmlFor={`companions[${index}].Name`} className="mr-4">
                    Vorname Nachname
                  </label>
                  <br />
                  <Controller
                    name={`companions[${index}].Name`}
                    control={control}
                    rules={{
                      required: "Name ist ein Pflichtfeld.",
                    }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={`companions[${index}].Name`}
                        {...field}
                        autoFocus
                        className={classNames({
                          "p-invalid": fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  <br />
                  {getFormErrorMessage(`companions[${index}].Name`)}
                </div>
                <div className="field">
                  <Controller
                    name={`companions[${index}].Vegetarian`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        inputId={`companions[${index}].Vegetarian`}
                        checked={field.value}
                        className={"ml-1"}
                        onChange={(e) => field.onChange(e.checked)}
                      />
                    )}
                  />
                  <label
                    htmlFor={`companions[${index}].Vegetarian`}
                    className="ml-1"
                  >
                    Vegetarier
                  </label>
                </div>
                <div className="field">
                  <Controller
                    name={`companions[${index}].Vegan`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        inputId={`companions[${index}].Vegan`}
                        checked={field.value}
                        className={"ml-1"}
                        onChange={(e) => {
                          field.onChange(e.checked);
                          e.checked
                            ? setValue(`companions[${index}].Vegetarian`, true)
                            : setValue(
                                `companions[${index}].Vegetarian`,
                                false
                              );
                        }}
                      />
                    )}
                  />
                  <label
                    htmlFor={`companions[${index}].Vegan`}
                    className="ml-1"
                  >
                    Vegan
                  </label>
                </div>
                <div className="field">
                  <Controller
                    name={`companions[${index}].Child`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        inputId={`companions[${index}].Child`}
                        checked={field.value}
                        className={"ml-1"}
                        onChange={(e) => field.onChange(e.checked)}
                      />
                    )}
                  />
                  <label
                    htmlFor={`companions[${index}].Child`}
                    className="ml-1"
                  >
                    Kind
                  </label>
                </div>
                <Button
                  type="button"
                  label="Begleitung entfernen"
                  onClick={() => {
                    remove(index);
                  }}
                  className="p-button-text mt-4 mb-4 mr-8 bg-red-200 hover:bg-red-400 text-black font-bold py-2 px-4 rounded"
                />
              </Card>
            ))}
            <Button
              type="button"
              label="Begleitung hinzufügen"
              onClick={() => append({})}
              className="p-button-outlined mt-2"
            />

            <br />
            <Button
              type="submit"
              label="Abschicken"
              className="mt-4 p-button-text mb-4 mr-8 bg-green-200 hover:bg-green-400 text-black font-bold py-2 px-4 rounded"
            />
          </form>
        </Dialog>
      </div>
    </>
  );
};

export default SignupFormModal;
