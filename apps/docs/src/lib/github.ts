export const owner = "techwithanirudh";
export const repo = "coolify-tweaks";

export async function getRepoStarsAndForks(
  owner: string,
  repo: string,
  token?: string,
  baseUrl = 'https://api.github.com',
): Promise<{
  stars: number;
  forks: number;
}> {
  const endpoint = `${baseUrl}/repos/${owner}/${repo}`;
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(endpoint, {
    headers,
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(`Failed to fetch repository data: ${message}`);
  }

  const data = await response.json() as {
    stargazers_count: number;
    forks_count: number;
  };

  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
  };
}

export function humanizeNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }

  if (num < 100000) {
    const value = (num / 1000).toFixed(1);
    const formattedValue = value.endsWith('.0') ? value.slice(0, -2) : value;

    return `${formattedValue}K`;
  }

  if (num < 1000000) {
    return `${Math.floor(num / 1000)}K`;
  }

  return num.toString();
}
