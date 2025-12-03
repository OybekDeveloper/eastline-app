"use client";

import { useMemo, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormDescription, FormLabel } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import { absoluteUrl, siteConfig } from "@/lib/seo";

const ROBOTS_OPTIONS = [
  { label: "index, follow", value: "index, follow" },
  { label: "noindex, nofollow", value: "noindex, nofollow" },
  { label: "index, nofollow", value: "index, nofollow" },
  { label: "noindex, follow", value: "noindex, follow" },
];

const OG_TYPE_OPTIONS = [
  { label: "Product", value: "product" },
  { label: "Category", value: "category" },
  { label: "Website", value: "website" },
];

export const createSeoDefaults = (ogType = "website") => ({
  meta_title: "",
  meta_description: "",
  meta_keywords: [],
  meta_robots: "",
  canonical_url: "",
  open_graph: {
    og_title: "",
    og_description: "",
    og_image: "",
    og_type: ogType,
    og_locale: "",
  },
  twitter: {
    twitter_card: "",
    twitter_title: "",
    twitter_description: "",
    twitter_image: "",
  },
  structured_data: "",
  custom_meta: [],
});

const MetaPreview = ({ title, description, url, keywords }) => (
  <div className="rounded-lg border border-muted-foreground/40 bg-white p-4 shadow-sm">
    <p className="text-[15px] font-semibold text-blue-600">
      {title || siteConfig.name}
    </p>
    <p className="text-xs text-muted-foreground mt-1">
      {description || siteConfig.description}
    </p>
    <p className="mt-2 text-[11px] text-slate-500">{url}</p>
    {keywords && keywords.length > 0 && (
      <p className="text-[11px] text-slate-500 mt-1">
        Ключевые слова: {keywords.join(", ")}
      </p>
    )}
  </div>
);

const Section = ({ title, hint, children }) => (
  <div className="rounded-2xl border border-muted-foreground/20 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between gap-3">
      <FormLabel className="text-base font-semibold">{title}</FormLabel>
      {hint && (
        <span className="text-[11px] text-muted-foreground">{hint}</span>
      )}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const SeoMetadataForm = ({ form }) => {
  const control = form.control;
  const metaTitle = useWatch({
    control,
    name: "seo.meta_title",
  }) || "";
  const metaDescription = useWatch({
    control,
    name: "seo.meta_description",
  }) || "";
  const metaKeywords = useWatch({
    control,
    name: "seo.meta_keywords",
  }) || [];
  const metaRobots = useWatch({
    control,
    name: "seo.meta_robots",
  }) || "";
  const canonicalUrl = useWatch({
    control,
    name: "seo.canonical_url",
  }) || "";
  const ogTitle = useWatch({
    control,
    name: "seo.open_graph.og_title",
  }) || "";
  const ogDescription = useWatch({
    control,
    name: "seo.open_graph.og_description",
  }) || "";
  const ogImage = useWatch({
    control,
    name: "seo.open_graph.og_image",
  }) || "";
  const ogType = useWatch({
    control,
    name: "seo.open_graph.og_type",
  }) || "";
  const ogLocale = useWatch({
    control,
    name: "seo.open_graph.og_locale",
  }) || "";
  const twitterCard = useWatch({
    control,
    name: "seo.twitter.twitter_card",
  }) || "";
  const twitterTitle = useWatch({
    control,
    name: "seo.twitter.twitter_title",
  }) || "";
  const twitterDescription = useWatch({
    control,
    name: "seo.twitter.twitter_description",
  }) || "";
  const twitterImage = useWatch({
    control,
    name: "seo.twitter.twitter_image",
  }) || "";
  const { fields, append, remove } = useFieldArray({
    control,
    name: "seo.custom_meta",
  });
  const structuredDataWatcher = useWatch({
    control,
    name: "seo.structured_data",
  }) || "";

  const previewUrl = canonicalUrl || absoluteUrl("/");

  const customMetaCount = useMemo(() => fields.length, [fields.length]);
  const customMetaHasValues = useMemo(
    () =>
      Array.isArray(fields) &&
      fields.some((entry) => entry?.key || entry?.value),
    [fields]
  );

  const advancedHasValues = useMemo(
    () =>
      metaKeywords.length ||
      Boolean(metaRobots) ||
      Boolean(canonicalUrl) ||
      Boolean(ogTitle) ||
      Boolean(ogDescription) ||
      Boolean(ogImage) ||
      Boolean(ogType) ||
      Boolean(ogLocale) ||
      Boolean(twitterCard) ||
      Boolean(twitterTitle) ||
      Boolean(twitterDescription) ||
      Boolean(twitterImage) ||
      Boolean(structuredDataWatcher) ||
      Boolean(customMetaHasValues),
    [
      metaKeywords.length,
      metaRobots,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      ogType,
      ogLocale,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImage,
      structuredDataWatcher,
      customMetaHasValues,
    ]
  );

  const [advancedOpen, setAdvancedOpen] = useState(false);

  const toggleAdvanced = () => {
    setAdvancedOpen((prev) => !prev);
  };

  const advancedContainerClasses = advancedOpen
    ? "max-h-[2200px] opacity-100"
    : "max-h-0 opacity-0 pointer-events-none";

  return (
    <div className="space-y-4">
      <Section title="SEO / Metadata" hint="Задать основные теги">
        <MetaPreview
          title={metaTitle}
          description={metaDescription}
          url={previewUrl}
          keywords={metaKeywords}
        />
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <FormLabel className="text-sm font-medium">Meta Title</FormLabel>
            <span className="text-[11px] text-muted-foreground">
              {metaTitle.length}/300
            </span>
            </div>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={control}
              name="seo.meta_title"
              label=""
              placeholder="Заголовок страницы (до 60 символов)"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <FormLabel className="text-sm font-medium">
                Meta Description
              </FormLabel>
              <span className="text-[11px] text-muted-foreground">
                {metaDescription.length}/600
              </span>
            </div>
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={control}
              name="seo.meta_description"
              label=""
              placeholder="Краткое описание страницы"
              className="min-h-[120px]"
            />
            <FormDescription className="text-[11px] text-muted-foreground">
              Используйте уникальное описание до 600 символов.
            </FormDescription>
          </div>
        </div>
        <div className="flex w-full justify-center pt-2">
          <button
            type="button"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            onClick={toggleAdvanced}
            aria-expanded={advancedOpen}
          >
            {advancedOpen ? "Скрыть расширенные настройки SEO" : "Показать расширенные настройки SEO"}
            {!advancedOpen && advancedHasValues ? " (сохранено)" : ""}
          </button>
        </div>
      </Section>
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${advancedContainerClasses}`}
        aria-hidden={!advancedOpen}
      >
        <Section title="Advanced SEO" hint="Дополнительные теги и директивы">
          <div className="space-y-4">
            <CustomFormField
              fieldType={FormFieldType.TAGS}
              control={control}
              name="seo.meta_keywords"
              label="Meta Keywords"
              placeholder="Добавьте ключевые слова"
              maxTags={25}
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={control}
              name="seo.meta_robots"
              label="Robots"
              placeholder="Выберите директивы"
            >
              {ROBOTS_OPTIONS.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={control}
              name="seo.canonical_url"
              label="Canonical URL"
              placeholder="https://example.com/путь"
            />
          </div>
        </Section>
        <Section title="Open Graph" hint="Изображение и описание для соцсетей">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="seo.open_graph.og_title"
            label="OG Title"
            placeholder="Заголовок для Open Graph"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={control}
            name="seo.open_graph.og_description"
            label="OG Description"
            placeholder="Описание для карточки соцсетей"
            className="min-h-[100px]"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="seo.open_graph.og_image"
            label="OG Image URL"
            placeholder="https://..."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={control}
              name="seo.open_graph.og_type"
              label="OG Type"
              placeholder="Выберите тип"
            >
              {OG_TYPE_OPTIONS.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={control}
              name="seo.open_graph.og_locale"
              label="OG Locale"
              placeholder="en_US"
            />
          </div>
        </Section>
        <Section title="Twitter Cards" hint="Карточки для Twitter">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={control}
            name="seo.twitter.twitter_card"
            label="Card Type"
            placeholder="Выберите тип"
          >
            <SelectItem value="summary">summary</SelectItem>
            <SelectItem value="summary_large_image">
              summary_large_image
            </SelectItem>
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="seo.twitter.twitter_title"
            label="Twitter Title"
            placeholder="Название для Twitter"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={control}
            name="seo.twitter.twitter_description"
            label="Twitter Description"
            placeholder="Описание для Twitter"
            className="min-h-[100px]"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="seo.twitter.twitter_image"
            label="Twitter Image URL"
            placeholder="https://..."
          />
        </Section>
        <div className="group rounded-2xl border border-muted-foreground/20 bg-white p-5 shadow-sm transition">
          <details className="space-y-4">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold">
              <span>Structured Data & Custom Meta</span>
              <span className="text-[11px] text-muted-foreground">
                {structuredDataWatcher ? "JSON введён" : "JSON отсутствует"}
              </span>
            </summary>
            <div className="space-y-4">
              <div className="space-y-1">
                <FormLabel className="text-sm font-medium">
                  Structured Data (JSON-LD)
                </FormLabel>
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={control}
                  name="seo.structured_data"
                  label=""
                  placeholder='{"@context": "https://schema.org", ...}'
                  className="min-h-[140px] font-mono text-[13px]"
                />
                <FormDescription className="text-[11px] text-muted-foreground">
                  Вставьте валидный JSON-LD. Поле проверяется на корректность.
                </FormDescription>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium">Custom Meta</FormLabel>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => append({ key: "", value: "" })}
                  >
                    Добавить
                  </Button>
                </div>
                {fields.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Добавьте свои мета-теги для будущих интеграций.
                  </p>
                )}
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
                    >
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={control}
                        name={`seo.custom_meta.${index}.key`}
                        label="Key"
                        placeholder="Например, theme-color"
                      />
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={control}
                        name={`seo.custom_meta.${index}.value`}
                        label="Value"
                        placeholder="Цвет или значение"
                      />
                      <button
                        type="button"
                        className="text-xs text-destructive underline-offset-2 hover:underline"
                        onClick={() => remove(index)}
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                </div>
                {customMetaCount > 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    Сохранено {customMetaCount} записей.
                  </p>
                )}
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default SeoMetadataForm;
