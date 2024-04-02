import { Avatar, Button, Flex, Text } from "@chakra-ui/react";
import { IUser } from "../interface/threads";
import { postFollow } from "../services/follow.services";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getLoginUser } from "../services/user.services";
import { GET_LOGIN_USER } from "../redux/features/userLoginSlice";
import { useDispatch } from "react-redux";

export default function CardSuggestUser(Props: IUser) {
    const navigate = useNavigate();
    const [follow, setFollow] = useState<boolean>(false);
    const dispatch = useDispatch();

    const handleFollowUser = async (id: number) => {
        const token = localStorage.getItem("token");
        const userLoginId = localStorage.getItem("userId");
        setFollow(!follow);

        const userData = await getLoginUser(Number(userLoginId));
        dispatch(GET_LOGIN_USER(userData));

        if (token) {
            const resp = await postFollow(id, token);
            if (resp.response.status == 401) {
                navigate("/login");
            }
            // navigate(0);
        } else {
            navigate("/login");
        }
    };

    return (
        <Flex gap={3} alignItems={"center"} justifyContent={"space-between"} key={Props.id}>
            <Flex gap={3} alignItems={"center"}>
                <Avatar src={Props.image} size={"sm"} />
                <Flex flexDir={"column"}>
                    <Text fontSize={"sm"} fontWeight={"bold"}>
                        {Props.full_name}
                    </Text>
                    <Text color={"grey"} fontSize={"xs"}>
                        @{Props.username}
                    </Text>
                </Flex>
            </Flex>

            <Button size={"xs"} rounded={"xl"} colorScheme="gray" onClick={() => handleFollowUser(Props.id)}>
                {follow ? "UnFollow" : "Follow"}
            </Button>
        </Flex>
    );
}
