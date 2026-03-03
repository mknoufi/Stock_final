import { renderHook, act } from "@testing-library/react-native";
import { useFormValidation } from "../useFormValidation";

describe("useFormValidation", () => {
  const initialConfig = [
    {
      name: "email",
      label: "Email",
      rules: {
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email",
        },
      },
    },
    {
      name: "password",
      label: "Password",
      rules: {
        required: "Password is required",
        minLength: { value: 6, message: "Password too short" },
      },
    },
  ];

  it("initializes with default values", () => {
    const { result } = renderHook(() => useFormValidation(initialConfig));
    expect(result.current.values).toEqual({ email: "", password: "" });
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it("updates field values", () => {
    const { result } = renderHook(() => useFormValidation(initialConfig));

    act(() => {
      result.current.setValue("email", "test@test.com");
    });

    expect(result.current.values.email).toBe("test@test.com");
  });

  it("validates fields on blur (setFieldTouched)", () => {
    // NOTE: setFieldTouched implementation in hook doesn't trigger validation automatically
    // It just sets state. Validation is triggered manually or on submit usually.
    // But looking at code: setFieldTouched just sets touched state.
    const { result } = renderHook(() => useFormValidation(initialConfig));
    act(() => {
      result.current.setFieldTouched("email", true);
    });
    expect(result.current.touched.email).toBe(true);
  });

  it("validates all fields on submit", async () => {
    const { result } = renderHook(() => useFormValidation(initialConfig));
    const mockSubmit = jest.fn();
    const handleSubmit = result.current.handleSubmit(mockSubmit);

    await act(async () => {
      await handleSubmit();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.email).toBe("Email is required");
    expect(result.current.errors.password).toBe("Password is required");
  });

  it("allows submit with valid data", async () => {
    const { result } = renderHook(() => useFormValidation(initialConfig));
    const mockSubmit = jest.fn();

    act(() => {
      result.current.setValue("email", "valid@test.com");
      result.current.setValue("password", "123456");
    });

    const handleSubmit = result.current.handleSubmit(mockSubmit);
    await act(async () => {
      await handleSubmit();
    });

    expect(mockSubmit).toHaveBeenCalledWith({
      email: "valid@test.com",
      password: "123456",
    });
    expect(result.current.errors).toEqual({});
  });

  it("handles custom validation", async () => {
    const customConfig = [
      {
        name: "username",
        rules: {
          custom: (value: any) => (value === "admin" ? "Admin not allowed" : null),
        },
      },
    ];
    const { result } = renderHook(() => useFormValidation(customConfig));

    act(() => {
      result.current.setValue("username", "admin");
    });

    const handleSubmit = result.current.handleSubmit(jest.fn());
    await act(async () => {
      await handleSubmit();
    });

    expect(result.current.errors.username).toBe("Admin not allowed");
  });
});
