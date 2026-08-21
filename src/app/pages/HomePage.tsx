import { appConfig } from '@/utils/appConfig';

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-large bg-primary-500 text-3xl font-bold text-content-on-color sm:h-24 sm:w-24 sm:text-4xl">
        {appConfig.appName
          .split(' ')
          .map((word: string) => word[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)}
      </div>
      <h1 className="mb-4 text-3xl font-bold text-content sm:text-4xl">{appConfig.appName}</h1>
    </div>
  );
}

