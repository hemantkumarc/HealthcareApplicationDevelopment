import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    StyledAlbumArtThumb,
    StyledArtistDetails,
    StyledArtistName,
    StyledDynamicIsland,
    StyledDynamicIslandTopContent,
    StyledMusicIcon,
    StyledMusicIconBar,
    StyledPlayBarWrapper,
    StyledSongName,
} from "./DynamicIsland.styles.js";

const StyledDynamicIslandMotion = motion(StyledDynamicIsland);
const StyledMusicIconBarMotion = motion(StyledMusicIconBar);
const StyledMusicAlbumArtThumbMotion = motion(StyledAlbumArtThumb);
const StyledMusicIconMotion = motion(StyledMusicIcon);
const StyledArtistDetailsMotion = motion(StyledArtistDetails);

const DynamicIsland = () => {
    const [count, setCount] = useState(0);
    const [time, setTime] = useState("00:00:00");

    var initTime = new Date();

    const showTimer = (ms) => {
        const milliseconds = Math.floor((ms % 1000) / 10)
            .toString()
            .padStart(2, "0");
        const second = Math.floor((ms / 1000) % 60)
            .toString()
            .padStart(2, "0");
        const minute = Math.floor((ms / 1000 / 60) % 60)
            .toString()
            .padStart(2, "0");
        // const hour = Math.floor(ms / 1000 / 60 / 60).toString();
        setTime(
            // hour.padStart(2, "0") +
            // ":" +
            minute + ":" + second + ":" + milliseconds
        );
    };

    useEffect(() => {
        var id = setInterval(() => {
            var left = count + (new Date() - initTime);
            setCount(left);
            showTimer(left);
            if (left <= 0) {
                setTime("00:00:00:00");
                clearInterval(id);
            }
        }, 1);
        return () => clearInterval(id);
    });
    const [isOpen, setIsOpen] = useState(false);

    const variants = {
        open: {
            width: "300px",
            height: "auto",
            borderRadius: "20px",
        },
        closed: {
            width: "250px",
            height: "35px",
            borderRadius: "99px",
        },
    };

    const iconVariants = {
        open: {
            width: "48px",
            height: "48px",
            borderRadius: "12px",
        },
        closed: {
            width: "18px",
            height: "18px",
            borderRadius: "4px",
        },
    };

    return (
        <StyledDynamicIslandMotion
            animate={isOpen ? "open" : "closed"}
            variants={variants}
            onClick={() => setIsOpen(!isOpen)}
            isOpen={isOpen}
        >
            <StyledDynamicIslandTopContent isOpen={isOpen}>
                <StyledMusicAlbumArtThumbMotion
                    animate={isOpen ? "open" : "closed"}
                    variants={iconVariants}
                    src={require("../../assets/1281044-middle-removebg-preview.png")}
                />
                <div>
                    {isOpen && (
                        <StyledArtistDetailsMotion
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <StyledMusicIconMotion
                                animate={{ opacity: isOpen ? [0, 1] : 1 }}
                                style={{ marginLeft: "150px" }}
                            >
                                <StyledMusicIconBarMotion
                                    initial={{ height: "0" }}
                                    animate={{ height: "100%" }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.5,
                                        repeat: Infinity,
                                    }}
                                />
                                <StyledMusicIconBarMotion
                                    initial={{ height: "0" }}
                                    animate={{ height: "100%" }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.75,
                                        repeat: Infinity,
                                    }}
                                />
                                <StyledMusicIconBarMotion
                                    initial={{ height: "0" }}
                                    animate={{ height: "75%" }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.3,
                                        repeat: Infinity,
                                    }}
                                />
                            </StyledMusicIconMotion>
                            <StyledMusicIconMotion
                                animate={{ opacity: isOpen ? [0, 1] : 1 }}
                                style={{
                                    position: "absolute",
                                    marginTop: "-43px",
                                    marginLeft: "160px",
                                }}
                            >
                                <StyledMusicIconBarMotion
                                    initial={{ height: "0" }}
                                    animate={{ height: "100%" }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.5,
                                        repeat: Infinity,
                                    }}
                                />
                                <StyledMusicIconBarMotion
                                    initial={{ height: "0" }}
                                    animate={{ height: "100%" }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.75,
                                        repeat: Infinity,
                                    }}
                                />
                                <StyledMusicIconBarMotion
                                    initial={{ height: "0" }}
                                    animate={{ height: "75%" }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.3,
                                        repeat: Infinity,
                                    }}
                                />
                            </StyledMusicIconMotion>
                            <StyledMusicIconMotion
                                animate={{ opacity: isOpen ? [0, 1] : 1 }}
                                style={{
                                    position: "absolute",
                                    marginTop: "-43px",
                                    marginLeft: "140px",
                                }}
                            >
                                <StyledMusicIconBarMotion
                                    initial={{ height: "0" }}
                                    animate={{ height: "100%" }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.5,
                                        repeat: Infinity,
                                    }}
                                />
                                <StyledMusicIconBarMotion
                                    initial={{ height: "0" }}
                                    animate={{ height: "100%" }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.75,
                                        repeat: Infinity,
                                    }}
                                />
                                <StyledMusicIconBarMotion
                                    initial={{ height: "0" }}
                                    animate={{ height: "75%" }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.3,
                                        repeat: Infinity,
                                    }}
                                />
                            </StyledMusicIconMotion>
                            <StyledSongName style={{ marginTop: "-16px" }}>
                                Jethalal
                            </StyledSongName>
                            <StyledArtistName>Mumbai</StyledArtistName>
                        </StyledArtistDetailsMotion>
                    )}
                </div>
                <StyledMusicIconMotion
                    animate={{ opacity: isOpen ? [0, 1] : 1 }}
                >
                    <StyledMusicIconBarMotion
                        initial={{ height: "0" }}
                        animate={{ height: "100%" }}
                        transition={{
                            duration: 1,
                            delay: 0.5,
                            repeat: Infinity,
                        }}
                    />
                    <StyledMusicIconBarMotion
                        initial={{ height: "0" }}
                        animate={{ height: "100%" }}
                        transition={{
                            duration: 1,
                            delay: 0.75,
                            repeat: Infinity,
                        }}
                    />
                    <StyledMusicIconBarMotion
                        initial={{ height: "0" }}
                        animate={{ height: "75%" }}
                        transition={{
                            duration: 1,
                            delay: 0.3,
                            repeat: Infinity,
                        }}
                    />
                </StyledMusicIconMotion>
                <StyledMusicIconMotion
                    animate={{ opacity: isOpen ? [0, 1] : 1 }}
                    style={{ position: "absolute", marginLeft: "190px" }}
                >
                    <StyledMusicIconBarMotion
                        initial={{ height: "0" }}
                        animate={{ height: "100%" }}
                        transition={{
                            duration: 1,
                            delay: 0.3,
                            repeat: Infinity,
                        }}
                    />
                    <StyledMusicIconBarMotion
                        initial={{ height: "0" }}
                        animate={{ height: "100%" }}
                        transition={{
                            duration: 1,
                            delay: 0.5,
                            repeat: Infinity,
                        }}
                    />
                    <StyledMusicIconBarMotion
                        initial={{ height: "0" }}
                        animate={{ height: "75%" }}
                        transition={{
                            duration: 1,
                            delay: 0.75,
                            repeat: Infinity,
                        }}
                    />
                </StyledMusicIconMotion>
            </StyledDynamicIslandTopContent>

            {isOpen && (
                <>
                    <StyledPlayBarWrapper>
                        <h4 style={{ marginLeft: "79px", color: "beige" }}>
                            {time}
                        </h4>
                    </StyledPlayBarWrapper>
                </>
            )}
        </StyledDynamicIslandMotion>
    );
};

DynamicIsland.displayName = "DynamicIsland";

export default DynamicIsland;
