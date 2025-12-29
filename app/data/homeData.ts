import fitur1 from "@/assets/images/home/fitur1.png"
import fitur2 from "@/assets/images/home/fitur2.png"
import fitur4 from "@/assets/images/home/fitur4.png"
import fitur7 from "@/assets/images/home/fitur7.png"
import post1 from "@/assets/images/home/post1.png";
import profile from "@/assets/images/home/profile.png";
import post from "@/assets/images/home/post.png";

export const homeData = [
    {
        id: 1,
        image: fitur1,
        name: "Pantau",
        link: "/pages/maps/maps"
    },
    {
        id: 2,
        image: fitur2,
        name: "Cerita AR",
        link: ""
    },
    {
        id: 3,
        image: fitur7,
        name: "Konsultasi",
        link: "/pages/consultation/consultation"
    },
    {
        id: 4,
        image: fitur4,
        name: "Meditasi",
        link: "/pages/mediation/mediation"
    },
];

export const postAnimation = [
    {
        id: 1,
        image: post1
    },
    {
        id: 2,
        image: post1
    },
    {
        id: 3,
        image: post1
    },
];

export const profileMenu = [
    {
        id: 1,
        name: "Ubah Profile",
        link: "",
        image: profile,
    },
    {
        id: 2,
        name: "Postingan Saya",
        link: "",
        image: post,
    },
]