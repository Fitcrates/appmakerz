import { urlFor } from '../lib/sanity.client';

export const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="relative w-full h-auto my-8">
          <img
            src={urlFor(value).width(800).height(400).url()}
            alt={value.alt || ' '}
            className="rounded-lg object-cover"
          />
        </div>
      );
    },
  },
};
