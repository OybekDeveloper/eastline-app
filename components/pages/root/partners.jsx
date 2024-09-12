import Container from "@/components/shared/container";
import CustomImage from "@/components/shared/customImage";
import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Partners = ({ partner }) => {
  return (
    <Container className="mt-5 space-y-3 md:bg-primary w-[95%] py-6 rounded-xl flex-col lg:w-10/12 lg:mx-auto justify-end items-start md:justify-center mx-auto gap-3">
      <div className="px-6 w-full flex justify-between items-center gap-2">
        <h1 className="font-medium textNormal4 lg:text-white text-primary">
          Партнеры
        </h1>
        {/* <p className="font-medium textSmall lg:text-white text-primary">
          Подробно
        </p> */}
      </div>
      <Carousel
        className="w-full h-full text-foreground relative"
        paginate={"false"}
      >
        <CarouselPrevious className="hidden md:flex absolute top-1/2 -left-0 rounded-md z-30 shadow-md" />
        <CarouselContent className="md:h-full px-6 py-2 max-md:pb-6">
          {partner.map((item, index) => {
            return (
              <CarouselItem
                key={index}
                className="basis-full sm:basis-[45%] md:basis-[33.3%] bg-white mr-2 rounded-md"
              >
                <CustomImage
                  src={item.image}
                  alt={item.image}
                  className="w-full max-md:border rounded-lg"
                  width={100}
                  height={100}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselNext className="hidden md:flex absolute top-1/2 -right-0 rounded-md shadow-md z-30" />
        <CarouselCounter classNameCounter="bg-primary" className="md:hidden" />
      </Carousel>
    </Container>
  );
};

export default Partners;
