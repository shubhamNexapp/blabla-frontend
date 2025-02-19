import React, { useState, useEffect } from "react";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Testimonials } from "./components/testimonials";
import { Team } from "./components/Team";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
// import './css/nivo-lightbox/nivo_lightbox.css'
import './css/landingstyle.css'
// import './css/bootstrap.css'
import NavCompo from './components/NavCompo'
import { Contact } from "./components/contact";
import WhoWeServe from "./components/WhoWeServe";




export const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 500,
    speedAsDuration: true,
});

const index = () => {
    const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    return (
        <div className="homepage-div">
            {/* <Navigation /> */}
            <NavCompo />
            <Header data={landingPageData.Header} />
            <Features data={landingPageData.Features} />
            <About data={landingPageData.About} />
            <Services data={landingPageData.Services} />
            {/* <Gallery data={landingPageData.Gallery} /> */}
            <WhoWeServe />
            <Team data={landingPageData.Team} />
            {/* <Testimonials data={landingPageData.Testimonials} /> */}

            <Contact data={landingPageData.Contact} />
        </div>
    )
}

export default index