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
"4-big-stock-market-mistakes-hindi.mdx": {
	id: "4-big-stock-market-mistakes-hindi.mdx";
  slug: "4-big-stock-market-mistakes-hindi";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"algo-and-high-frequency-trading-india.mdx": {
	id: "algo-and-high-frequency-trading-india.mdx";
  slug: "algo-and-high-frequency-trading-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"algo-trading-kya-hai-bharat-me-kaise-shuru-kare-2025-guide.mdx": {
	id: "algo-trading-kya-hai-bharat-me-kaise-shuru-kare-2025-guide.mdx";
  slug: "algo-trading-kya-hai-bharat-me-kaise-shuru-kare-2025-guide";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"bazaar-ka-u-turn-sensex-ceasefire-news.mdx": {
	id: "bazaar-ka-u-turn-sensex-ceasefire-news.mdx";
  slug: "bazaar-ka-u-turn-sensex-ceasefire-news";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"bazar-me-uchhal-defence-stocks-dhadham.mdx": {
	id: "bazar-me-uchhal-defence-stocks-dhadham.mdx";
  slug: "bazar-me-uchhal-defence-stocks-dhadham";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"bull-and-bear-market-cycles-india.mdx": {
	id: "bull-and-bear-market-cycles-india.mdx";
  slug: "bull-and-bear-market-cycles-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"corporate-actions-explained-dividend-stock-split-bonus-guide-hindi.mdx": {
	id: "corporate-actions-explained-dividend-stock-split-bonus-guide-hindi.mdx";
  slug: "corporate-actions-explained-dividend-stock-split-bonus-guide-hindi";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"esg-investing-kya-hai-india-guide.mdx": {
	id: "esg-investing-kya-hai-india-guide.mdx";
  slug: "esg-investing-kya-hai-india-guide";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"financial-statements-kaise-padhen-beginners-guide-hindi.mdx": {
	id: "financial-statements-kaise-padhen-beginners-guide-hindi.mdx";
  slug: "financial-statements-kaise-padhen-beginners-guide-hindi";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"fundamental-analysis-kya-hai-day-3.mdx": {
	id: "fundamental-analysis-kya-hai-day-3.mdx";
  slug: "fundamental-analysis-kya-hai-day-3";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"fundamental-analysis-kya-hai-stock-value-guide.mdx": {
	id: "fundamental-analysis-kya-hai-stock-value-guide.mdx";
  slug: "fundamental-analysis-kya-hai-stock-value-guide";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"global-investing-indian-investors-foreign-stocks.mdx": {
	id: "global-investing-indian-investors-foreign-stocks.mdx";
  slug: "global-investing-indian-investors-foreign-stocks";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"indias-3-biggest-stock-market-scams-lessons-learned.mdx": {
	id: "indias-3-biggest-stock-market-scams-lessons-learned.mdx";
  slug: "indias-3-biggest-stock-market-scams-lessons-learned";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"ipo-se-listing-tak-company-ke-public-hone-ka-safar.mdx": {
	id: "ipo-se-listing-tak-company-ke-public-hone-ka-safar.mdx";
  slug: "ipo-se-listing-tak-company-ke-public-hone-ka-safar";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"iran-america-tanav-sensex-tuta-niveshak-kya-kare.mdx": {
	id: "iran-america-tanav-sensex-tuta-niveshak-kya-kare.mdx";
  slug: "iran-america-tanav-sensex-tuta-niveshak-kya-kare";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"macro-factors-economy-policies-drive-investments-hindi.mdx": {
	id: "macro-factors-economy-policies-drive-investments-hindi.mdx";
  slug: "macro-factors-economy-policies-drive-investments-hindi";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"mutual-fund-aur-etf-share-bazar-mein-nivesh-ke-smart-tareeke.mdx": {
	id: "mutual-fund-aur-etf-share-bazar-mein-nivesh-ke-smart-tareeke.mdx";
  slug: "mutual-fund-aur-etf-share-bazar-mein-nivesh-ke-smart-tareeke";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"passive-investing-index-funds-vs-etfs-india.mdx": {
	id: "passive-investing-index-funds-vs-etfs-india.mdx";
  slug: "passive-investing-index-funds-vs-etfs-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"psychology-of-investing-behavioral-biases-in-stock-market.mdx": {
	id: "psychology-of-investing-behavioral-biases-in-stock-market.mdx";
  slug: "psychology-of-investing-behavioral-biases-in-stock-market";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"share-bazaar-record-breaking-rally-sensex-crosses-84000.mdx": {
	id: "share-bazaar-record-breaking-rally-sensex-crosses-84000.mdx";
  slug: "share-bazaar-record-breaking-rally-sensex-crosses-84000";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"share-bazar-guide-day-2-demat-se-pehli-trade.mdx": {
	id: "share-bazar-guide-day-2-demat-se-pehli-trade.mdx";
  slug: "share-bazar-guide-day-2-demat-se-pehli-trade";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"share-bazar-kaise-kaam-karta-hai-hindi.mdx": {
	id: "share-bazar-kaise-kaam-karta-hai-hindi.mdx";
  slug: "share-bazar-kaise-kaam-karta-hai-hindi";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"share-bazar-ke-zaruri-shabd-bull-bear-blue-chip-ko-samjhen.mdx": {
	id: "share-bazar-ke-zaruri-shabd-bull-bear-blue-chip-ko-samjhen.mdx";
  slug: "share-bazar-ke-zaruri-shabd-bull-bear-blue-chip-ko-samjhen";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"share-bazar-ki-abcd-day-1-basics.mdx": {
	id: "share-bazar-ki-abcd-day-1-basics.mdx";
  slug: "share-bazar-ki-abcd-day-1-basics";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"share-bazar-me-nivesh-kaise-shuru-karein-beginners-guide.mdx": {
	id: "share-bazar-me-nivesh-kaise-shuru-karein-beginners-guide.mdx";
  slug: "share-bazar-me-nivesh-kaise-shuru-karein-beginners-guide";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"share-bazar-me-shandar-wapsi-sensex-1000-nifty-25100-par.mdx": {
	id: "share-bazar-me-shandar-wapsi-sensex-1000-nifty-25100-par.mdx";
  slug: "share-bazar-me-shandar-wapsi-sensex-1000-nifty-25100-par";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"share-market-101-stocks-kya-hain-aur-kaise-kaam-karta-hai.mdx": {
	id: "share-market-101-stocks-kya-hain-aur-kaise-kaam-karta-hai.mdx";
  slug: "share-market-101-stocks-kya-hain-aur-kaise-kaam-karta-hai";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"share-market-ke-3-maharathi-retail-dii-fii-investors.mdx": {
	id: "share-market-ke-3-maharathi-retail-dii-fii-investors.mdx";
  slug: "share-market-ke-3-maharathi-retail-dii-fii-investors";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"stock-market-index-kya-hota-hai.mdx": {
	id: "stock-market-index-kya-hota-hai.mdx";
  slug: "stock-market-index-kya-hota-hai";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"stock-market-mein-risk-management-apni-capital-kaise-bachayein.mdx": {
	id: "stock-market-mein-risk-management-apni-capital-kaise-bachayein.mdx";
  slug: "stock-market-mein-risk-management-apni-capital-kaise-bachayein";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"stock-market-tax-rules-india-fy-2024-25.mdx": {
	id: "stock-market-tax-rules-india-fy-2024-25.mdx";
  slug: "stock-market-tax-rules-india-fy-2024-25";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"stock-portfolio-kaise-banaye-diversification-asset-allocation-strategies.mdx": {
	id: "stock-portfolio-kaise-banaye-diversification-asset-allocation-strategies.mdx";
  slug: "stock-portfolio-kaise-banaye-diversification-asset-allocation-strategies";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"stock-trading-hidden-charges-india.mdx": {
	id: "stock-trading-hidden-charges-india.mdx";
  slug: "stock-trading-hidden-charges-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"stocks-kitne-prakar-ke-hote-hain.mdx": {
	id: "stocks-kitne-prakar-ke-hote-hain.mdx";
  slug: "stocks-kitne-prakar-ke-hote-hain";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"technical-analysis-basics-charts-trends-hindi.mdx": {
	id: "technical-analysis-basics-charts-trends-hindi.mdx";
  slug: "technical-analysis-basics-charts-trends-hindi";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"thematic-investing-bharat-ke-future-trends-mein-nivesh.mdx": {
	id: "thematic-investing-bharat-ke-future-trends-mein-nivesh.mdx";
  slug: "thematic-investing-bharat-ke-future-trends-mein-nivesh";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"tradetron-kya-hai-bina-coding-ke-algo-trading-kaise-kare.mdx": {
	id: "tradetron-kya-hai-bina-coding-ke-algo-trading-kaise-kare.mdx";
  slug: "tradetron-kya-hai-bina-coding-ke-algo-trading-kaise-kare";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"trading-vs-investing-kya-hai-behtar-guide.mdx": {
	id: "trading-vs-investing-kya-hai-behtar-guide.mdx";
  slug: "trading-vs-investing-kya-hai-behtar-guide";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"upstox-kya-hai-2024-guide.mdx": {
	id: "upstox-kya-hai-2024-guide.mdx";
  slug: "upstox-kya-hai-2024-guide";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"what-is-fno-futures-and-options-explained-hindi.mdx": {
	id: "what-is-fno-futures-and-options-explained-hindi.mdx";
  slug: "what-is-fno-futures-and-options-explained-hindi";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"zerodha-review-2025-hindi.mdx": {
	id: "zerodha-review-2025-hindi.mdx";
  slug: "zerodha-review-2025-hindi";
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
