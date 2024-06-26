import { Avatar, Box, Button, Flex, HStack, Heading, Image, Input, VStack, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CardThread from "../component/cardThread";
import { RiImageAddLine } from "react-icons/ri";
import { getThreads, postThread } from "../services/thread.services";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GET_THREADS } from "../redux/features/threadSlice";
import { RootState } from "../redux/store";

const Home = () => {
    const navigate = useNavigate();
    const threads = useSelector((state: RootState) => state.threads.data);
    const userLogin = useSelector((state: RootState) => state.userLogin.data);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [postImg, setPostImg] = useState<any>();
    const dispatch = useDispatch();
    const toast = useToast();

    useEffect(() => {
        const itemStr = localStorage.getItem("item");
        if (!itemStr) {
            return navigate("/login");
        }
        const item = JSON.parse(itemStr!);

        if (new Date().getTime() > item.expiry) {
            localStorage.removeItem("item");
            navigate("/login");
        }
        async function fetchData() {
            if (item.userId) {
                const threadsData = await getThreads(Number(item.userId));
                dispatch(GET_THREADS(threadsData));
                console.log("success fetch threads");
            }
        }
        fetchData();
    }, [dispatch, navigate]);

    const createThread = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const content = e.currentTarget.content.value;
        const image = e.currentTarget.image.files[0];

        const dataThread = { content, image };
        if (dataThread.content.length == 0 && !dataThread.image)
            return toast({
                title: "Failed post a thread!",
                description: "Field cannot be empty!.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });

        const itemStr = localStorage.getItem("item");
        const item = JSON.parse(itemStr!);

        if (item.token) {
            const res = await postThread(dataThread, item.token);
            if (res.statusText == "Unauthorized" || res.status == 401) {
                localStorage.removeItem("item");
                navigate("/login");
            }

            // window.location.reload();
            const threadsData = await getThreads(Number(item.userId));
            dispatch(GET_THREADS(threadsData));
            console.log("success postThread");
        }
    };

    return (
        <Box>
            <Flex w={{ base: "100%", md: "100%" }} color={"black"} border={"2px"} borderColor={"whitesmoke"} p={10} flexDir={"column"}>
                <Heading as={"h3"} size={"md"}>
                    Hi {userLogin.full_name} ✌😊
                </Heading>

                <form onSubmit={createThread}>
                    <HStack spacing={4} mt={8} mb={10}>
                        <Avatar src={userLogin.image} name="profile" size={"md"} />
                        <Input type="text" placeholder="What is happening?!" border={"none"} name="content" />
                        <Box className="input-image">
                            <Box as={"label"} htmlFor="input-img">
                                <RiImageAddLine size={"40"} color="darkGreen" />
                            </Box>
                            <input name="image" type="file" id="input-img" style={{ display: "none" }} onChange={(e) => setPostImg(URL.createObjectURL(e.target.files![0]))} />
                        </Box>
                        <Button colorScheme="whatsapp" size="md" type="submit">
                            Post
                        </Button>
                    </HStack>
                </form>
                {postImg && <Image objectFit={"cover"} ml={20} mt={5} w={200} h={200} src={postImg}></Image>}

                <VStack>
                    {threads.map((thread) => (
                        <CardThread
                            key={thread.id}
                            id={thread.id}
                            user={thread.user}
                            username={thread.user.username}
                            full_name={thread.user.full_name}
                            created_at={new Date(thread.created_at).toDateString()}
                            content={thread.content}
                            image={thread.image}
                            likes_count={thread.likes_count}
                            replies_count={thread.replies_count}
                            isLiked={thread.isLiked}
                        />
                    ))}
                </VStack>
            </Flex>
        </Box>
    );
};

export default Home;
