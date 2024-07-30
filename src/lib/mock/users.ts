import type { FairUser } from "../models/user";

export const mockedUsers: FairUser[] = [
  {
    email: "teste1@gmail.com",
    fairId: "43a8f788-4db9-11ef-95df-3e7bf1c93a1f", // Fair 1
    inviteAccepted: true,
  },
  {
    email: "teste2@gmail.com",
    fairId: "43a8f788-4db9-11ef-95df-3e7bf1c93a1f", // Fair 1
  },
  {
    email: "teste3@gmail.com",
    fairId: "50dea3a8-4db9-11ef-9f55-3e7bf1c93a1f", // Fair 2
    inviteAccepted: true,
  },
  {
    email: "teste4@gmail.com",
    fairId: "50dea3a8-4db9-11ef-9f55-3e7bf1c93a1f", // Fair 2
    inviteAccepted: true,
  },
];
