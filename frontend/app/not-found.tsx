import { Container, Heading } from "@chakra-ui/react";

function NotFoundPage() {
  return (
    <Container
      maxW={"6xl"}
      px="1.6rem"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Heading as="h2" size="xl" textAlign="center" fontFamily={""}>
        Oops! Page not found
      </Heading>
    </Container>
  );
}

export default NotFoundPage;
