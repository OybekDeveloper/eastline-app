import Container from "./container";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Link from "next/link";
import CustomImage from "./customImage";

const AllCategories = ({ categories }) => {
  return (
    <Container className="pt-5 w-[95%] flex-col lg:w-10/12 lg:mx-auto justify-end items-start md:justify-center mx-0 ml-auto">
      <p className="textNormal4 font-semibold">Каталог товаров</p>
      <Carousel className="w-full text-foreground" paginate={"false"}>
        <CarouselContent>
          {categories.map((item, i) => {
            return (
              <CarouselItem
                key={i}
                className="basis-[35%] md:basis-[25%] lg:basis-[20%] mr-5"
              >
                <Link
                  href={`/${item.topCategoryId}/${item.id}`}
                  className="px-3 flex flex-col justify-center items-center gap-y-1"
                >
                  <div className="relative h-[100px] md:h-[200px] overflow-hidden flex justify-center items-center">
                    <CustomImage
                      src={`${item.image}`}
                      width={100}
                      height={100}
                      alt={`Категория ${item.name}`}
                      className="w-full mx-auto  object-contain"
                    />
                  </div>
                  <p className="textSmall3 font-semibold">{item.name}</p>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </Container>
  );
};

export default AllCategories;
