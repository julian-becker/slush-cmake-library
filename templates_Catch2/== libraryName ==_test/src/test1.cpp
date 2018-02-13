#define CATCH_CONFIG_MAIN  // This tells Catch to provide a main() - only do this in one cpp file
#include <catch.hpp>
#include <<%= libraryName %>/<%= libraryName %>.h>

TEST_CASE("<%= libraryName %>_api_foobar returns the ultimate result","[<%= libraryName %>_api_foobar]") {
    REQUIRE(42 == <%= libraryName %>_api());
}
