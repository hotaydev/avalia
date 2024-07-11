import { Evaluator } from "@/lib/models/evaluator";

const mockData: Evaluator[] = [
  {
    id: 1,
    name: "Dr. Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "555-1234",
    field: "Physics",
    projects: 5
  },
  {
    id: 2,
    name: "Prof. Bob Smith",
    email: "bob.smith@example.com",
    phone: "555-5678",
    field: "Chemistry",
    projects: 3
  },
  {
    id: 3,
    name: "Dr. Carol White",
    field: "Biology",
    projects: 4
  },
  {
    id: 4,
    name: "Dr. David Brown",
    email: "david.brown@example.com",
    projects: 2
  },
  {
    id: 5,
    name: "Prof. Emily Green",
    phone: "555-8765",
    field: "Mathematics",
    projects: 1
  },
  {
    id: 6,
    name: "Dr. Frank Black",
    email: "frank.black@example.com",
    phone: "555-4321",
    projects: 0,
  },
  {
    id: 7,
    name: "Dr. Grace Lee",
    email: "grace.lee@example.com",
    phone: "555-9988",
    field: "Computer Science",
    projects: 6
  },
  {
    id: 8,
    name: "Prof. Henry Wilson",
    phone: "555-7766",
    field: "Engineering",
    projects: 2
  },
  {
    id: 9,
    name: "Dr. Isabella Martinez",
    email: "isabella.martinez@example.com",
    field: "Environmental Science",
    projects: 3
  },
  {
    id: 10,
    name: "Prof. Jack Davis",
    phone: "555-3344",
    field: "Geology",
    projects: 4
  },
  {
    id: 11,
    name: "Dr. Karen Rodriguez",
    email: "karen.rodriguez@example.com",
    projects: 5
  },
  {
    id: 12,
    name: "Prof. Liam Harris",
    email: "liam.harris@example.com",
    phone: "555-4455",
    field: "Astronomy",
    projects: 0,
  },
];

export async function GET() {
  return Response.json(mockData);
}