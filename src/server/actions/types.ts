/** Return type every form-bound Server Action resolves to (besides
 * `redirect()`, which throws internally and never actually returns this).
 * Consumed by `useFormState` on the client to render errors/success inline
 * without any Redux/RTK Query state. */
export type ActionState = { error?: string; success?: string } | undefined;
