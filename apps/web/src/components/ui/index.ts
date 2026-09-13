/**
 * Kit UI façon shadcn, bâti sur MUI.
 *
 * Chaque composant est un habillage fin d'une primitive MUI, avec un jeu de
 * variantes restreint et documenté (voir le fichier de chaque composant, et
 * la page de démo `/ui-kit`). But : un vocabulaire commun (`Button`, `Card`,
 * `Input`…) et des styles cohérents sans réinventer MUI.
 */
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./Button";
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";
export { Heading, type HeadingProps, type HeadingLevel, Text, type TextProps, type TextSize, Muted, Label, type LabelProps } from "./Typography";
export { Input, type InputProps } from "./Input";
export { Textarea, type TextareaProps } from "./Textarea";
export { Select, type SelectProps, type SelectOption } from "./Select";
export { Checkbox, type CheckboxProps, SwitchInput, type SwitchInputProps } from "./Checkbox";
export { Badge, type BadgeProps, type BadgeVariant } from "./Badge";
export { FormField, type FormFieldProps } from "./FormField";
