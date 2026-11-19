import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HeaderSearch } from "./index";

const mockAuth = {
  isAuthenticated: true,
  logout: jest.fn(),
  loginWithRedirect: jest.fn(),
};
jest.mock("@auth0/auth0-react", () => ({ useAuth0: () => mockAuth }));
jest.mock("app/components/search", () => ({ Search: () => null }));

const renderHeader = () =>
  render(
    <MemoryRouter>
      <HeaderSearch
        searchOpen={false}
        mobileMenuOpen={false}
        setSearchOpen={jest.fn()}
        setMobileMenuOpen={jest.fn()}
      />
    </MemoryRouter>,
  );

beforeEach(() => {
  mockAuth.isAuthenticated = true;
  // The header scrolls to the top on navigation; jsdom has no scrolling.
  window.scrollTo = jest.fn();
});

test("logging out returns to the site it was started from", () => {
  renderHeader();
  fireEvent.click(screen.getByRole("button", { name: "Log out" }));
  expect(mockAuth.logout).toHaveBeenCalledWith({
    logoutParams: { returnTo: window.location.origin },
  });
});

test("signed-out users are sent to log in", () => {
  mockAuth.isAuthenticated = false;
  renderHeader();
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  expect(mockAuth.loginWithRedirect).toHaveBeenCalled();
  expect(mockAuth.logout).not.toHaveBeenCalled();
});
