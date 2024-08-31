import { ContactForm } from "@/components/forms/contact";
import Container from "@/components/shared/container";
import React from "react";

async function Contacts() {
  return (
    <Container className="min-h-[80vh] py-10 flex-col lg:flex-row gap-5">
      <div className="w-[40%] max-lg:w-full">
        <ContactForm />
      </div>
      <div className="w-1/2 max-lg:w-full space-y-2 lg:space-y-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d222.4159718328911!2d69.32904202537738!3d41.27646533409087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8bfe684f97cf%3A0xd0dce31d167916a1!2sEast%20Line%20Telekom!5e0!3m2!1sru!2s!4v1722676775534!5m2!1sru!2s"
          className="w-full aspect-video rounded-lg"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <ul className="space-y-2 lg:space-y-4 font-semibold textNormal2">
          <li>
            г. Ташкент, Яшнабадский район, ул. Махзуна, 1-тупик, дом 14А.
            Ориентир: Масложирокомбинат.
          </li>
          <li>
            Моб.: <a href={`tel: +998909337880`}>+998 90 933-78-80</a>
            <br /> Тел.: <a href={`tel: +998555108133`}>+998 55 510-81-33</a>
          </li>
          <li>Эл. Почта: info@elt.uz</li>
        </ul>
      </div>
    </Container>
  );
};
export default Contacts