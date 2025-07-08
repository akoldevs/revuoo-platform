import { Stack, Card, Text, Grid } from "@sanity/ui";
import { set, unset, StringInputProps } from "sanity";
import { useCallback } from "react";
import {
  Book,
  Settings,
  HelpCircle,
  Users,
  Shield,
  FileText,
  Briefcase,
} from "lucide-react";

const icons = [
  { label: "Book", value: "book", Icon: Book },
  { label: "Settings", value: "settings", Icon: Settings },
  { label: "Help", value: "helpcircle", Icon: HelpCircle },
  { label: "Users", value: "users", Icon: Users },
  { label: "Shield", value: "shield", Icon: Shield },
  { label: "File", value: "filetext", Icon: FileText },
  { label: "Briefcase", value: "briefcase", Icon: Briefcase },
];

export function IconPicker(props: StringInputProps) {
  const { value, onChange } = props;

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val === value ? unset() : set(val));
    },
    [onChange, value]
  );

  return (
    <Stack space={3}>
      <Text size={1} weight="semibold">
        Select an Icon
      </Text>
      <Grid columns={[2, 3, 4]} gap={2}>
        {icons.map(({ label, value: val, Icon }) => (
          <Card
            key={val}
            padding={3}
            radius={2}
            shadow={1}
            tone={value === val ? "primary" : "default"}
            onClick={() => handleSelect(val)}
            style={{
              cursor: "pointer",
              textAlign: "center",
              border: value === val ? "2px solid #6366f1" : "1px solid #e5e7eb",
            }}
          >
            <Stack space={2}>
              <div className="flex flex-col items-center">
                <Icon size={20} />
                <Text size={1}>{label}</Text>
              </div>
            </Stack>
          </Card>
        ))}
      </Grid>
    </Stack>
  );
}
