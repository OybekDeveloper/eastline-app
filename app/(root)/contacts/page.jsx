import { ContactForm } from "@/components/forms/contact";
import Container from "@/components/shared/container";
import React from "react";
import { getData } from "@/lib/api.services";
import JsonLd from "@/components/seo/json-ld";
import {
  buildBreadcrumbJsonLd,
  buildContactPageJsonLd,
  buildMetadata,
  siteConfig,
} from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Контакты EAST LINE TELEKOM",
  description:
    "Свяжитесь с EAST LINE TELEKOM: телефон, адрес офиса в Ташкенте и форма обратной связи.",
  path: "/contacts",
});

async function Contacts() {
  const contactResponse = await getData("/api/contact", "contact").catch(
    () => []
  );
  const contact = contactResponse?.[0];
  const addressText = contact?.address || siteConfig.address;
  const phoneNumbers = [contact?.phone1, contact?.phone2].filter(Boolean);
  const email = contact?.email || siteConfig.contactEmail;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Контакты", path: "/contacts" },
  ]);
  const contactSchema = buildContactPageJsonLd(contact);

  const formatPhoneHref = (phone) =>
    phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : undefined;

  return (
    <Container className="min-h-[80vh] py-10 flex-col lg:flex-row gap-5">
      <JsonLd id="contacts-breadcrumbs" data={breadcrumbJsonLd} />
      <JsonLd id="contacts-schema" data={contactSchema} />
      <div className="w-[40%] max-lg:w-full">
        <ContactForm />
      </div>
      <div className="w-1/2 max-lg:w-full space-y-2 lg:space-y-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d222.4159718328911!2d69.32904202537738!3d41.27646533409087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8bfe684f97cf%3A0xd0dce31d167916a1!2sEast%20Line%20Telekom!5e0!3m2!1sru!2s!4v1722676775534!5m2!1sru!2s"
          className="w-full aspect-video rounded-lg"
          allowFullScreen=""
          loading="lazy"
          title="Офис EAST LINE TELEKOM на карте"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <ul className="space-y-2 lg:space-y-4 font-semibold textNormal2">
          <li>
            <address className="not-italic">{addressText}</address>
          </li>
          {phoneNumbers.length > 0 && (
            <li>
              {phoneNumbers.map((phone, index) => (
                <div key={`${phone}-${index}`} className="flex flex-col">
                  <span>
                    Телефон {index + 1}:{" "}
                    <a href={formatPhoneHref(phone)}>{phone}</a>
                  </span>
                </div>
              ))}
            </li>
          )}
          <li>
            Эл. почта:{" "}
            <a className="underline" href={`mailto:${email}`}>
              {email}
            </a>
          </li>
        </ul>
      </div>
    </Container>
  );
}
export default Contacts;
