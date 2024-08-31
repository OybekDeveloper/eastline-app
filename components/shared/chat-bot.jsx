"use client";
import { useEffect } from "react";

export default function ChatBot() {
  useEffect(() => {
    (function (a, m, o, c, r, m2) {
      a[m2] = {
        id: "413950",
        hash: "e993bc16f534103748c8a7ad9036e6f45189df1b22a2971ac33608898736c73c",
        locale: "ru",
        inline: false,
        setMeta: function (p) {
          this.params = (this.params || []).concat([p]);
        },
      };
      a[o] = function () {
        (a[o].q = a[o].q || []).push(arguments);
      };
      var d = a.document,
        s = d.createElement("script");
      s.async = true;
      s.id = m2 + "_script";
      s.src = "https://gso.amocrm.ru/js/button.js";
      d.head && d.head.appendChild(s);
    })(window, 0, "amoSocialButton", 0, 0, "amo_social_button");
  }, []);

  return <></>;
}
