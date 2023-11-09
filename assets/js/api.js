async function GET_PROJECT() {
    const res = await axios.get(domain + "/api/project");
    return res.data;
}

// axios1().then((res) => console.log(res.data));
