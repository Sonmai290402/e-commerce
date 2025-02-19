type TActiveLinkProps = {
  url: string;
  children: React.ReactNode;
};

type TMenuItem = {
  url: string;
  title: string;
  icon?: React.ReactNode;
};

type TCreateUserParams = {
  clerkId: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
};

type TCreateProductParams = {
  category: string;
  subCategory: string;
  title: string;
  slug: string;
};

type TCategoryItemProps = {
  title: string;
  image: string;
};

export {
  TCreateUserParams,
  TActiveLinkProps,
  TMenuItem,
  TCreateProductParams,
  TCategoryItemProps,
};
