import React, { useState } from 'react';
import {
    Carousel,
    CarouselItem,
    CarouselIndicators,
} from 'reactstrap';

import img1 from "../../assets/images/users/avatar-1.jpg";
import img2 from "../../assets/images/users/avatar-2.jpg";
import img3 from "../../assets/images/users/avatar-3.jpg";

const items = [
    {
        id: 1,
        img: img1,
        name: "Richard Drews",
        designation: "Web Designer",
        description: "Empowering businesses to elevate customer experiences. Partner with us for reliable services that drive success."
    },
    {
        id: 2,
        img: img2,
        name: "Rosanna French",
        designation: "Web Developer",
        description: "Connecting your business with top-notch services for your clients. Together, we create seamless solutions that enhance satisfaction."
    },
    {
        id: 3,
        img: img3,
        name: "Ilse R. Eaton",
        designation: "Manager",
        description: "Unlock new opportunities through our expert services. We’re dedicated to supporting your business and your customers."
    }
];

const CarouselPage = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }

    const slides = items.map((item) => {
        return (
            <CarouselItem
                tag="div"
                key={item.id}
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
            >
                <div className="carousel-item active">
                    <div className="testi-contain text-white">
                        <i className="bx bxs-quote-alt-left text-success display-6"></i>

                        <h4 className="mt-4 fw-medium lh-base text-white">“{item.description}”
                        </h4>
                        <div className="mt-4 pt-3 pb-5">
                            {/* <div className="d-flex align-items-start">
                                <div className="flex-shrink-0">
                                    <img src={item.img} className="avatar-md img-fluid rounded-circle" alt="..." />
                                </div>
                                <div className="flex-grow-1 ms-3 mb-4">
                                    <h5 className="font-size-18 text-white">{item.name}
                                    </h5>
                                    <p className="mb-0 text-white-50">{item.designation}</p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </CarouselItem>
        );
    });

    return (
        <React.Fragment>
            <div className="col-xxl-8 col-lg-8 col-md-7">
                <div className="auth-bg pt-md-5 p-4 d-flex">
                    <div className="bg-overlay bg-primay"></div>
                    <ul className="bg-bubbles">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <div className="row justify-content-center align-items-center">
                        <div className="col-xl-7">
                            <div className="p-0 p-sm-4 px-xl-0">
                                <div id="reviewcarouselIndicators" className="carousel slide" data-bs-ride="carousel">
                                    <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} className='carousel-indicators-rounded justify-content-start ms-0 mb-0' />
                                    <Carousel
                                        activeIndex={activeIndex}
                                        next={next}
                                        previous={previous}
                                    >
                                        {slides}

                                    </Carousel>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default CarouselPage;