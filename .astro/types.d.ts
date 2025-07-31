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
"ai-aur-aapki-naukri-ka-sach.mdx": {
	id: "ai-aur-aapki-naukri-ka-sach.mdx";
  slug: "ai-aur-aapki-naukri-ka-sach";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"ai-aur-programming-ka-bhavishya-kya-code-sikhna-zaruri-nahi-raha.mdx": {
	id: "ai-aur-programming-ka-bhavishya-kya-code-sikhna-zaruri-nahi-raha.mdx";
  slug: "ai-aur-programming-ka-bhavishya-kya-code-sikhna-zaruri-nahi-raha";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"ai-investing-future-reddit-lesson.mdx": {
	id: "ai-investing-future-reddit-lesson.mdx";
  slug: "ai-investing-future-reddit-lesson";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"ai-ka-asli-khel-karmachari-bahar-munafa-andar.mdx": {
	id: "ai-ka-asli-khel-karmachari-bahar-munafa-andar.mdx";
  slug: "ai-ka-asli-khel-karmachari-bahar-munafa-andar";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"ai-verification-challenge-and-solution.mdx": {
	id: "ai-verification-challenge-and-solution.mdx";
  slug: "ai-verification-challenge-and-solution";
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
"apollo-hospitals-demerger-new-company-shares.mdx": {
	id: "apollo-hospitals-demerger-new-company-shares.mdx";
  slug: "apollo-hospitals-demerger-new-company-shares";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"axis-bank-q1-results-market-fall-sensex-nifty.mdx": {
	id: "axis-bank-q1-results-market-fall-sensex-nifty.mdx";
  slug: "axis-bank-q1-results-market-fall-sensex-nifty";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"bajaj-twins-results-market-fall-sensex-nifty.mdx": {
	id: "bajaj-twins-results-market-fall-sensex-nifty.mdx";
  slug: "bajaj-twins-results-market-fall-sensex-nifty";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"banking-stocks-saved-market-despite-titan-fall.mdx": {
	id: "banking-stocks-saved-market-despite-titan-fall.mdx";
  slug: "banking-stocks-saved-market-despite-titan-fall";
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
"bazar-me-bhari-giravat-tcs-weak-results-global-tension.mdx": {
	id: "bazar-me-bhari-giravat-tcs-weak-results-global-tension.mdx";
  slug: "bazar-me-bhari-giravat-tcs-weak-results-global-tension";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"bazar-me-raunak-mahangai-aur-damdar-nateeje.mdx": {
	id: "bazar-me-raunak-mahangai-aur-damdar-nateeje.mdx";
  slug: "bazar-me-raunak-mahangai-aur-damdar-nateeje";
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
"char-din-ki-teji-par-break-profit-booking-se-gire-sensex-nifty.mdx": {
	id: "char-din-ki-teji-par-break-profit-booking-se-gire-sensex-nifty.mdx";
  slug: "char-din-ki-teji-par-break-profit-booking-se-gire-sensex-nifty";
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
"eternal-zomato-stock-surge-blinkit-q1-fy26.mdx": {
	id: "eternal-zomato-stock-surge-blinkit-q1-fy26.mdx";
  slug: "eternal-zomato-stock-surge-blinkit-q1-fy26";
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
"gabriel-india-stock-20-percent-surge-reason.mdx": {
	id: "gabriel-india-stock-20-percent-surge-reason.mdx";
  slug: "gabriel-india-stock-20-percent-surge-reason";
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
"iex-share-crash-market-coupling-analysis.mdx": {
	id: "iex-share-crash-market-coupling-analysis.mdx";
  slug: "iex-share-crash-market-coupling-analysis";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"indian-market-rebound-sensex-nifty-rally-29-july-2025.mdx": {
	id: "indian-market-rebound-sensex-nifty-rally-29-july-2025.mdx";
  slug: "indian-market-rebound-sensex-nifty-rally-29-july-2025";
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
"it-stocks-fall-sensex-nifty-down.mdx": {
	id: "it-stocks-fall-sensex-nifty-down.mdx";
  slug: "it-stocks-fall-sensex-nifty-down";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"itc-hotels-damdar-pradarshan-all-time-high.mdx": {
	id: "itc-hotels-damdar-pradarshan-all-time-high.mdx";
  slug: "itc-hotels-damdar-pradarshan-all-time-high";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"jiopc-launch-tv-as-ai-computer.mdx": {
	id: "jiopc-launch-tv-as-ai-computer.mdx";
  slug: "jiopc-launch-tv-as-ai-computer";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"kyon-phisala-share-bazar-profit-booking-global-sanketon-ne-sensex-nifty-ko-giraya.mdx": {
	id: "kyon-phisala-share-bazar-profit-booking-global-sanketon-ne-sensex-nifty-ko-giraya.mdx";
  slug: "kyon-phisala-share-bazar-profit-booking-global-sanketon-ne-sensex-nifty-ko-giraya";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"lnt-q1-fy26-results-analysis-investment.mdx": {
	id: "lnt-q1-fy26-results-analysis-investment.mdx";
  slug: "lnt-q1-fy26-results-analysis-investment";
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
"nykaa-block-deal-share-price-fall-investor-guide.mdx": {
	id: "nykaa-block-deal-share-price-fall-investor-guide.mdx";
  slug: "nykaa-block-deal-share-price-fall-investor-guide";
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
"pc-jeweller-stock-comeback-analysis-july-2025.mdx": {
	id: "pc-jeweller-stock-comeback-analysis-july-2025.mdx";
  slug: "pc-jeweller-stock-comeback-analysis-july-2025";
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
"real-estate-stocks-fall-lodha-oberoi-block-deals.mdx": {
	id: "real-estate-stocks-fall-lodha-oberoi-block-deals.mdx";
  slug: "real-estate-stocks-fall-lodha-oberoi-block-deals";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"reliance-record-profit-stock-fall-explained.mdx": {
	id: "reliance-record-profit-stock-fall-explained.mdx";
  slug: "reliance-record-profit-stock-fall-explained";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"sensex-nifty-sapat-band-americi-tariff-sebi-janch-se-bazar-mein-susti.mdx": {
	id: "sensex-nifty-sapat-band-americi-tariff-sebi-janch-se-bazar-mein-susti.mdx";
  slug: "sensex-nifty-sapat-band-americi-tariff-sebi-janch-se-bazar-mein-susti";
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
"share-bazar-giravat-kotak-bank-q1-results.mdx": {
	id: "share-bazar-giravat-kotak-bank-q1-results.mdx";
  slug: "share-bazar-giravat-kotak-bank-q1-results";
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
"share-bazar-mein-lagatar-chauthe-din-giravat-it-stocks-tariff-ka-dar.mdx": {
	id: "share-bazar-mein-lagatar-chauthe-din-giravat-it-stocks-tariff-ka-dar.mdx";
  slug: "share-bazar-mein-lagatar-chauthe-din-giravat-it-stocks-tariff-ka-dar";
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
"tariff-fear-vedanta-negative-report-indian-market-fall.mdx": {
	id: "tariff-fear-vedanta-negative-report-indian-market-fall.mdx";
  slug: "tariff-fear-vedanta-negative-report-indian-market-fall";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"tcs-ke-nateejey-aaj-it-sector-aur-bazar-ki-disha-hogi-tay.mdx": {
	id: "tcs-ke-nateejey-aaj-it-sector-aur-bazar-ki-disha-hogi-tay.mdx";
  slug: "tcs-ke-nateejey-aaj-it-sector-aur-bazar-ki-disha-hogi-tay";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"tcs-layoffs-future-ai-impact.mdx": {
	id: "tcs-layoffs-future-ai-impact.mdx";
  slug: "tcs-layoffs-future-ai-impact";
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
"technology-in-trading-and-investing-for-indian-investors.mdx": {
	id: "technology-in-trading-and-investing-for-indian-investors.mdx";
  slug: "technology-in-trading-and-investing-for-indian-investors";
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
"upstox-kya-hai-charges-products-services-2025-review.mdx": {
	id: "upstox-kya-hai-charges-products-services-2025-review.mdx";
  slug: "upstox-kya-hai-charges-products-services-2025-review";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"upstox-new-plus-plan-charges-features-hindi.mdx": {
	id: "upstox-new-plus-plan-charges-features-hindi.mdx";
  slug: "upstox-new-plus-plan-charges-features-hindi";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"upstox-vs-zerodha-vs-groww-best-discount-broker-india-2025.mdx": {
	id: "upstox-vs-zerodha-vs-groww-best-discount-broker-india-2025.mdx";
  slug: "upstox-vs-zerodha-vs-groww-best-discount-broker-india-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"vedanta-q1-fy25-results-analysis.mdx": {
	id: "vedanta-q1-fy25-results-analysis.mdx";
  slug: "vedanta-q1-fy25-results-analysis";
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
"wipro-q1-results-fy26-analysis.mdx": {
	id: "wipro-q1-results-fy26-analysis.mdx";
  slug: "wipro-q1-results-fy26-analysis";
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
