import { Avatar, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { getAllUsers, getLoginUser, getSuggestUser } from "../services/user.services";
import { useDispatch, useSelector } from "react-redux";
import { GET_ALL_USER } from "../redux/features/allUserSlice";
import { RootState } from "../redux/store";
import CardSuggestUser from "../component/cardSuggestUser";
import { GET_LOGIN_USER } from "../redux/features/userLoginSlice";
import { Link, useNavigate } from "react-router-dom";
import { ISuggestUser } from "../interface/suggestUser";

const SidebarProfile = () => {
    const dispatch = useDispatch();
    const userLogin = useSelector((state: RootState) => state.userLogin.data);
    const [suggestUsers, setSuggestUsers] = useState<null | ISuggestUser[]>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const itemStr = localStorage.getItem("item");
        if (!itemStr) {
            return navigate("/login");
        }
        const item = JSON.parse(itemStr!);

        window.scrollTo(0, 0);

        async function fetchData() {
            const allSuggestUser = await getSuggestUser(item.token);

            setSuggestUsers(allSuggestUser);
            const userData = await getLoginUser(Number(item.userId));
            dispatch(GET_LOGIN_USER(userData));

            const allUser = await getAllUsers();
            dispatch(GET_ALL_USER(allUser));
        }
        fetchData();
    }, [dispatch, navigate]);

    return (
        <>
            <Flex position={"sticky"} top={"0"} p={10} flexDir={"column"} gap={5}>
                <Flex backgroundImage={"linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)"} color={"black"} w={"full"} borderRadius={"5"} flexDir={"column"} p={5} gap={4}>
                    <Heading as={"h3"} size={"md"}>
                        My Profile
                    </Heading>
                    <Image
                        src={"https://img.freepik.com/free-photo/tibumana-waterfall-bali-island-indonesia_335224-356.jpg?t=st=1713162228~exp=1713165828~hmac=35c9bb6c43d5d0375a758d5576360161f3596b309f72588fbe706e403363a9ba&w=1060"}
                        fallbackSrc="https://via.placeholder.com/150"
                        objectFit={"cover"}
                        alt="Profile"
                        borderRadius="lg"
                        height={"100"}
                        width={"100%"}
                    />
                    {/* <Image src={userLogin?.image ? userLogin?.image : ""} fallbackSrc="https://via.placeholder.com/150" objectFit={"cover"} alt="Profile" borderRadius="lg" height={"100"} width={"100%"} /> */}

                    <Flex justifyContent={"space-between"}>
                        <Avatar src={userLogin?.image ? userLogin?.image : ""} objectFit={"cover"} size={"lg"} mt={"-12"} ml={4} border={"3px solid white"} />
                        <Link to="/profile">
                            <Button size={"xs"} rounded={"md"} colorScheme="gray">
                                Edit Profile
                            </Button>
                        </Link>
                    </Flex>
                    <Heading size="md">
                        {userLogin?.full_name} 👀
                        <Text fontSize={"sm"} color={"grey"} textColor={"gray"} fontWeight="light">
                            @ {userLogin?.username}
                        </Text>
                    </Heading>

                    <Text fontSize={"sm"}>{userLogin?.bio}</Text>
                    <Flex gap={4} fontSize={"sm"}>
                        <Text>{userLogin?.following_count} followings</Text>
                        <Text>{userLogin?.follower_count} followers</Text>
                    </Flex>
                </Flex>

                {/* LIST SUGGESTED USER CARD */}
                {/* <Flex color={"black"} w={"full"} borderRadius={"5"} flexDir={"column"} p={5} gap={4} bg={"linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(133,253,45,1) 100%)"}> */}
                <Flex color={"black"} w={"full"} borderRadius={"5"} flexDir={"column"} p={5} gap={4} backgroundImage={"linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)"}>
                    <Heading as={"h3"} size={"md"}>
                        Suggested For You
                    </Heading>

                    {suggestUsers && suggestUsers.map((user) => <CardSuggestUser key={user.id} id={user.id} bio={user.bio} username={user.username} full_name={user.full_name} image={user.image} />)}
                </Flex>

                {/* FOOTER PROFILE */}
                <Flex color={"black"} w={"full"} borderRadius={"5"} flexDir={"column"} p={5} gap={4} backgroundImage={"linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)"}>
                    <Heading as={"h3"} size={"sm"}>
                        <Flex gap={3}>
                            Develop by Dipa Galatian • <FaGithub /> <FaLinkedin /> <FaFacebook /> <FaInstagram />
                        </Flex>
                    </Heading>
                    <Text fontSize={"sm"} opacity={"40%"}>
                        Powered by Dumbways Indonesia • #1 Coding Bootcamp
                    </Text>
                </Flex>
            </Flex>
        </>
    );
};
export default SidebarProfile;
