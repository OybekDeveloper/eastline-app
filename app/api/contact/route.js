import db from "@/db/db";

// GET request handler for fetching contacts
export async function GET(req) {
  const id = await req.nextUrl.searchParams.get("id");
  if (id) {
    // Fetch a specific contact by ID
    const contact = await db.contacts.findUnique({
      where: { id: String(id) },
    });
    return Response.json({ data: contact });
  } else {
    // Fetch all contacts
    const contacts = await db.contacts.findMany();
    return Response.json({ data: contacts });
  }
}

// POST request handler for creating a new contact
export async function POST(req) {
  const data = await req.json();

  try {
    const newContact = await db.contacts.create({
      data,
    });

    return Response.json({ success: true, data: newContact });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

// DELETE request handler for deleting a contact
export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deletedContact = await db.contacts.delete({
      where: { id: String(id) },
    });

    return new Response(
      JSON.stringify({ success: true, data: "Contact deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

// PATCH request handler for updating a contact
export async function PATCH(req) {
  const data = await req.json();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const updatedContact = await db.contacts.update({
      where: { id: String(id) },
      data: {
        company_name: data.company_name,
        phone1: data.phone1,
        phone2: data.phone2,
        work_hours: data.work_hours,
        email: data.email,
        address: data.address,
        telegram: data.telegram,
        telegram_bot: data.telegram_bot,
        facebook: data.facebook,
        instagram: data.instagram,
        youtube: data.youtube,
        footer_info: data.footer_info,
        experience_info: data.experience_info,
        more_call_info: data.more_call_info,
      },
    });

    return new Response(
      JSON.stringify({ success: true, data: updatedContact }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
