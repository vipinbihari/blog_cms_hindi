declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"posts": {
"a-beginners-guide-to-understanding-the-indian-stock-market.mdx": {
	id: "a-beginners-guide-to-understanding-the-indian-stock-market.mdx";
  slug: "a-beginners-guide-to-understanding-the-indian-stock-market";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"dalal-street-defiance-nifty-soars-past-24900.mdx": {
	id: "dalal-street-defiance-nifty-soars-past-24900.mdx";
  slug: "dalal-street-defiance-nifty-soars-past-24900";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"dalal-street-ends-week-lower-sensex-slips-182-points-nifty-below-24800-gdp-jitters-global-cues-may-30-2025.mdx": {
	id: "dalal-street-ends-week-lower-sensex-slips-182-points-nifty-below-24800-gdp-jitters-global-cues-may-30-2025.mdx";
  slug: "dalal-street-ends-week-lower-sensex-slips-182-points-nifty-below-24800-gdp-jitters-global-cues-may-30-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"dalal-street-rallies-ahead-rbi-policy-sensex-nifty-gain-june-5-2025.mdx": {
	id: "dalal-street-rallies-ahead-rbi-policy-sensex-nifty-gain-june-5-2025.mdx";
  slug: "dalal-street-rallies-ahead-rbi-policy-sensex-nifty-gain-june-5-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"dalal-street-rebound-sensex-nifty-june-4-2025.mdx": {
	id: "dalal-street-rebound-sensex-nifty-june-4-2025.mdx";
  slug: "dalal-street-rebound-sensex-nifty-june-4-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"dalal-street-seesaws-sensex-nifty-tumble-june-3-2025.mdx": {
	id: "dalal-street-seesaws-sensex-nifty-tumble-june-3-2025.mdx";
  slug: "dalal-street-seesaws-sensex-nifty-tumble-june-3-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"dalal-street-tumbles-sensex-nifty-snap-rally-may-27-2025.mdx": {
	id: "dalal-street-tumbles-sensex-nifty-snap-rally-may-27-2025.mdx";
  slug: "dalal-street-tumbles-sensex-nifty-snap-rally-may-27-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"day-6-industry-economic-analysis-investing.mdx": {
	id: "day-6-industry-economic-analysis-investing.mdx";
  slug: "day-6-industry-economic-analysis-investing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"day-7-technical-analysis-part-1-chart-types-trend-basics.mdx": {
	id: "day-7-technical-analysis-part-1-chart-types-trend-basics.mdx";
  slug: "day-7-technical-analysis-part-1-chart-types-trend-basics";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"day-9-technical-chart-patterns.mdx": {
	id: "day-9-technical-chart-patterns.mdx";
  slug: "day-9-technical-chart-patterns";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"derivatives-explained-beginners-guide-futures-options.mdx": {
	id: "derivatives-explained-beginners-guide-futures-options.mdx";
  slug: "derivatives-explained-beginners-guide-futures-options";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"fundamental-analysis-financial-statements-day-4.mdx": {
	id: "fundamental-analysis-financial-statements-day-4.mdx";
  slug: "fundamental-analysis-financial-statements-day-4";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"fundamental-analysis-ratios-valuations-day-5.mdx": {
	id: "fundamental-analysis-ratios-valuations-day-5.mdx";
  slug: "fundamental-analysis-ratios-valuations-day-5";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"how-trading-works-indian-stock-market-day-3.mdx": {
	id: "how-trading-works-indian-stock-market-day-3.mdx";
  slug: "how-trading-works-indian-stock-market-day-3";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"indian-markets-rebound-us-tariff-ruling-may-29-2025.mdx": {
	id: "indian-markets-rebound-us-tariff-ruling-may-29-2025.mdx";
  slug: "indian-markets-rebound-us-tariff-ruling-may-29-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"indian-stock-market-structure-participants-day-2.mdx": {
	id: "indian-stock-market-structure-participants-day-2.mdx";
  slug: "indian-stock-market-structure-participants-day-2";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"itc-bat-stake-sale-market-impact-may-28-2025.mdx": {
	id: "itc-bat-stake-sale-market-impact-may-28-2025.mdx";
  slug: "itc-bat-stake-sale-market-impact-may-28-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"market-meltdown-sensex-nifty-june-12-2025.mdx": {
	id: "market-meltdown-sensex-nifty-june-12-2025.mdx";
  slug: "market-meltdown-sensex-nifty-june-12-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"metal-stocks-trump-tariff-threat-june-2-2025.mdx": {
	id: "metal-stocks-trump-tariff-threat-june-2-2025.mdx";
  slug: "metal-stocks-trump-tariff-threat-june-2-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"nifty-crosses-25000-sensex-soars-market-rallies-on-positive-cues.mdx": {
	id: "nifty-crosses-25000-sensex-soars-market-rallies-on-positive-cues.mdx";
  slug: "nifty-crosses-25000-sensex-soars-market-rallies-on-positive-cues";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"nifty-sensex-rally-june-9-2025-rbi-global-cues.mdx": {
	id: "nifty-sensex-rally-june-9-2025-rbi-global-cues.mdx";
  slug: "nifty-sensex-rally-june-9-2025-rbi-global-cues";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"options-strategies-guide-indian-investors.mdx": {
	id: "options-strategies-guide-indian-investors.mdx";
  slug: "options-strategies-guide-indian-investors";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"rbi-surprise-rate-cut-fuels-market-rally-june-7-2025.mdx": {
	id: "rbi-surprise-rate-cut-fuels-market-rally-june-7-2025.mdx";
  slug: "rbi-surprise-rate-cut-fuels-market-rally-june-7-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"sebis-t0-settlement-what-it-means-for-indian-investors.mdx": {
	id: "sebis-t0-settlement-what-it-means-for-indian-investors.mdx";
  slug: "sebis-t0-settlement-what-it-means-for-indian-investors";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"sensex-nifty-flat-volatile-trade-june-10-2025.mdx": {
	id: "sensex-nifty-flat-volatile-trade-june-10-2025.mdx";
  slug: "sensex-nifty-flat-volatile-trade-june-10-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"stock-market-101-investing-journey-day-1.mdx": {
	id: "stock-market-101-investing-journey-day-1.mdx";
  slug: "stock-market-101-investing-journey-day-1";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"stock-market-basics-day-10-risk-portfolio-management.mdx": {
	id: "stock-market-basics-day-10-risk-portfolio-management.mdx";
  slug: "stock-market-basics-day-10-risk-portfolio-management";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"what-is-pe-ratio-a-beginners-guide-to-valuing-stocks.mdx": {
	id: "what-is-pe-ratio-a-beginners-guide-to-valuing-stocks.mdx";
  slug: "what-is-pe-ratio-a-beginners-guide-to-valuing-stocks";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"what-is-short-selling-a-complete-guide-for-indian-investors.mdx": {
	id: "what-is-short-selling-a-complete-guide-for-indian-investors.mdx";
  slug: "what-is-short-selling-a-complete-guide-for-indian-investors";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"zee-promoters-inject-2237-crore-boost-stake-post-sony-fallout.mdx": {
	id: "zee-promoters-inject-2237-crore-boost-stake-post-sony-fallout.mdx";
  slug: "zee-promoters-inject-2237-crore-boost-stake-post-sony-fallout";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
