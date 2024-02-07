import ApiFormData from "@/types/ApiFormData";
import { NextResponse } from "next/server";
import prisma from "../../../prisma/prisma";
import { guest_Status, companion_Status } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as ApiFormData;
    const companions = data.companions ?? [];
    const createdGuest = await prisma.guest.create({
      data: {
        Name: data.name,
        Email: data.email,
        Hotel: data.hotel ?? false,
        Vegan: data.vegan ?? false,
        Vegetarian: data.vegetarian ?? false,
        Status: data.declined ? guest_Status.Refused : guest_Status.Accepted,
        companion: {
          createMany: {
            data: companions.map((item) => ({
              Name: item.Name,
              Hotel: data.hotel ?? false,
              Vegan: item.Vegan ?? false,
              Vegetarian: item.Vegetarian ?? false,
              Child: item.Child ?? false,
              Status: companion_Status.Accepted,
            })),
          },
        },
      },
    });

    return NextResponse.json({ result: createdGuest.Name }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
