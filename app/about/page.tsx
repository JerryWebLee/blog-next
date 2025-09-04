import { Counter } from "@/components/counter";
import { title } from "@/components/primitives";

export default function AboutPage() {
  return (
    <div>
      <h1 className={title()}>About</h1>
      <Counter />
    </div>
  );
}
